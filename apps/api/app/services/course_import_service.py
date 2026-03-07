import hashlib
import json
from dataclasses import asdict
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.integrations import get_course_provider
from app.integrations.course_provider import CourseProvider, NormalizedCourseDetail
from app.integrations.golfcourseapi import GolfCourseApiClientError
from app.models import Course, CourseHole
from app.schemas import ExternalCourseDetailRead, ExternalCourseSearchRead
from app.services.errors import ExternalServiceError, ValidationError


class CourseImportService:
    def __init__(self, db: Session, course_provider: CourseProvider | None = None) -> None:
        self.db = db
        self._course_provider = course_provider

    def search_courses(self, q: str) -> list[ExternalCourseSearchRead]:
        query = q.strip()
        if len(query) < 2:
            raise ValidationError("Search query must be at least 2 characters.")

        provider = self._resolve_course_provider()
        try:
            summaries = provider.search_courses(query)
        except GolfCourseApiClientError as exc:
            raise ExternalServiceError(exc.message) from exc
        except Exception as exc:
            raise ExternalServiceError("Course provider search failed.") from exc

        return [ExternalCourseSearchRead(**asdict(course)) for course in summaries]

    def get_external_course_detail(self, external_id: str) -> ExternalCourseDetailRead:
        provider = self._resolve_course_provider()
        try:
            detail = provider.get_course_detail(external_id.strip())
        except GolfCourseApiClientError as exc:
            raise ExternalServiceError(exc.message) from exc
        except Exception as exc:
            raise ExternalServiceError("Course provider detail lookup failed.") from exc
        return self._to_external_detail_read(detail)

    def import_course_snapshot(self, external_id: str) -> Course:
        normalized_external_id = external_id.strip()
        if not normalized_external_id:
            raise ValidationError("external_id is required.")

        provider = self._resolve_course_provider()
        try:
            detail = provider.get_course_detail(normalized_external_id)
        except GolfCourseApiClientError as exc:
            raise ExternalServiceError(exc.message) from exc
        except Exception as exc:
            raise ExternalServiceError("Course import from provider failed.") from exc
        try:
            return self._snapshot_external_course(detail)
        except IntegrityError as exc:
            self.db.rollback()
            raise ExternalServiceError("Malformed course payload from GolfCourseAPI.") from exc

    def hydrate_course_if_needed(self, course: Course) -> Course:
        # Lazy hydration: only fetch external details once for imported provider courses.
        # If holes already exist locally, keep returning local snapshot data without re-fetching.
        if course.source != "golfcourseapi" or course.external_course_id is None or course.holes:
            course.holes.sort(key=lambda hole: (hole.hole_number, hole.tee_name))
            return course

        provider = self._resolve_course_provider()
        try:
            detail = provider.get_course_detail(course.external_course_id)
        except GolfCourseApiClientError as exc:
            raise ExternalServiceError(exc.message) from exc
        except Exception as exc:
            raise ExternalServiceError("Course provider detail lookup failed.") from exc

        hydrated = self._snapshot_external_course(detail)
        self.db.commit()
        self.db.refresh(hydrated)
        hydrated.holes.sort(key=lambda hole: (hole.hole_number, hole.tee_name))
        return hydrated

    def _resolve_course_provider(self) -> CourseProvider:
        if self._course_provider is not None:
            return self._course_provider

        try:
            self._course_provider = get_course_provider()
        except RuntimeError as exc:
            raise ExternalServiceError("Course provider is not configured.") from exc

        return self._course_provider

    @staticmethod
    def _to_external_detail_read(detail: NormalizedCourseDetail) -> ExternalCourseDetailRead:
        return ExternalCourseDetailRead(
            external_id=detail.external_id,
            name=detail.name,
            city=detail.city,
            state=detail.state,
            country=detail.country,
            total_holes=detail.total_holes,
            source=detail.source,
            holes=[
                {
                    "id": hole.hole_number,
                    "hole_number": hole.hole_number,
                    "par": hole.par,
                    "yardage": hole.yardage,
                    "handicap": hole.handicap,
                    "tee_name": hole.tee_name,
                }
                for hole in detail.holes
            ],
        )

    def _snapshot_external_course(self, detail: NormalizedCourseDetail) -> Course:
        stmt = select(Course).where(
            Course.source == detail.source,
            Course.external_course_id == detail.external_id,
        )
        course = self.db.execute(stmt).scalar_one_or_none()

        now = datetime.now(UTC)
        payload_hash = self._build_payload_hash(detail)
        if course is None:
            course = Course(
                external_course_id=detail.external_id,
                name=detail.name,
                city=detail.city,
                state=detail.state,
                country=detail.country,
                total_holes=detail.total_holes,
                source=detail.source,
                imported_at=now,
                external_payload_hash=payload_hash,
            )
            self.db.add(course)
            self.db.flush()
        else:
            course.name = detail.name
            course.city = detail.city
            course.state = detail.state
            course.country = detail.country
            course.total_holes = detail.total_holes
            course.imported_at = now
            course.external_payload_hash = payload_hash

            existing_holes = (
                self.db.execute(select(CourseHole).where(CourseHole.course_id == course.id))
                .scalars()
                .all()
            )
            for row in existing_holes:
                self.db.delete(row)
            # Flush hole deletions before inserting new snapshot rows to satisfy
            # unique(course_id, hole_number, tee_name) within one transaction.
            self.db.flush()

        for hole in detail.holes:
            self.db.add(
                CourseHole(
                    course_id=course.id,
                    hole_number=hole.hole_number,
                    par=hole.par,
                    yardage=hole.yardage,
                    handicap=hole.handicap,
                    tee_name=hole.tee_name,
                )
            )

        self.db.flush()
        return course

    @staticmethod
    def _build_payload_hash(detail: NormalizedCourseDetail) -> str:
        serialized = json.dumps(asdict(detail), sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()
