from datetime import UTC, datetime

from sqlalchemy import Select, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Course, HoleScore, Round, RoundPlayer, RoundStatus, ShotContribution
from app.schemas import (
    CourseAssignRequest,
    CourseCreate,
    HoleScoreUpsert,
    RoundCreate,
    RoundPlayerCreate,
    ShotContributionCreate,
)
from app.services.errors import ConflictError, LockedRoundError, NotFoundError, ValidationError


class RoundService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_course(self, payload: CourseCreate) -> Course:
        course = Course(**payload.model_dump())
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def create_round(self, payload: RoundCreate) -> Round:
        round_obj = Round(notes=payload.notes)
        self.db.add(round_obj)
        self.db.commit()
        self.db.refresh(round_obj)
        return round_obj

    def get_round(self, round_id: int) -> Round:
        round_obj = self.db.get(Round, round_id)
        if round_obj is None:
            raise NotFoundError("Round not found.", {"round_id": str(round_id)})
        return round_obj

    def assign_course(self, round_id: int, payload: CourseAssignRequest) -> Round:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        course = self.db.get(Course, payload.course_id)
        if course is None:
            raise NotFoundError("Course not found.", {"course_id": str(payload.course_id)})

        round_obj.course_id = course.id
        self.db.commit()
        self.db.refresh(round_obj)
        return round_obj

    def add_player(self, round_id: int, payload: RoundPlayerCreate) -> RoundPlayer:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        current_count = self.db.scalar(
            select(func.count(RoundPlayer.id)).where(RoundPlayer.round_id == round_id)
        )
        if current_count is not None and current_count >= 4:
            raise ValidationError("A round can have at most 4 players.")

        player = RoundPlayer(
            round_id=round_id,
            display_name=payload.display_name.strip(),
            sort_order=payload.sort_order,
        )
        self.db.add(player)
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError(
                "Player sort order must be unique within a round.",
                {"sort_order": str(payload.sort_order)},
            ) from exc

        self.db.refresh(player)
        return player

    def complete_round(self, round_id: int) -> Round:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        player_count = self.db.scalar(
            select(func.count(RoundPlayer.id)).where(RoundPlayer.round_id == round_id)
        )
        if not player_count:
            raise ValidationError("At least one player is required before completing a round.")

        round_obj.status = RoundStatus.COMPLETED
        round_obj.completed_at = datetime.now(UTC)
        if round_obj.started_at is None:
            round_obj.started_at = round_obj.completed_at

        self.db.commit()
        self.db.refresh(round_obj)
        return round_obj

    def upsert_hole_score(
        self, round_id: int, hole_number: int, payload: HoleScoreUpsert
    ) -> HoleScore:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        stmt: Select[tuple[HoleScore]] = select(HoleScore).where(
            HoleScore.round_id == round_id, HoleScore.hole_number == hole_number
        )
        hole_score = self.db.execute(stmt).scalar_one_or_none()

        if hole_score is None:
            hole_score = HoleScore(
                round_id=round_id,
                hole_number=hole_number,
                score=payload.score,
                par_snapshot=payload.par_snapshot,
                completed=payload.completed,
            )
            self.db.add(hole_score)
        else:
            hole_score.score = payload.score
            hole_score.par_snapshot = payload.par_snapshot
            hole_score.completed = payload.completed

        if round_obj.status == RoundStatus.DRAFT:
            round_obj.status = RoundStatus.ACTIVE
            if round_obj.started_at is None:
                round_obj.started_at = datetime.now(UTC)

        self.db.commit()
        self.db.refresh(hole_score)
        return hole_score

    def add_shot_contributions(
        self, round_id: int, hole_number: int, payload: ShotContributionCreate
    ) -> list[ShotContribution]:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        player_ids = sorted(set(payload.round_player_ids))
        if not player_ids:
            raise ValidationError("At least one round_player_id is required.")

        players = (
            self.db.execute(
                select(RoundPlayer).where(
                    RoundPlayer.round_id == round_id, RoundPlayer.id.in_(player_ids)
                )
            )
            .scalars()
            .all()
        )
        if len(players) != len(player_ids):
            raise ValidationError("One or more players are not part of this round.")

        existing = (
            self.db.execute(
                select(ShotContribution).where(
                    ShotContribution.round_id == round_id,
                    ShotContribution.hole_number == hole_number,
                    ShotContribution.shot_number == payload.shot_number,
                    ShotContribution.round_player_id.in_(player_ids),
                )
            )
            .scalars()
            .all()
        )
        if existing:
            raise ConflictError(
                "Duplicate contribution exists for round, hole, shot, and player.",
                {"round_id": str(round_id), "hole_number": str(hole_number)},
            )

        records: list[ShotContribution] = []
        for player_id in player_ids:
            row = ShotContribution(
                round_id=round_id,
                hole_number=hole_number,
                shot_number=payload.shot_number,
                round_player_id=player_id,
                shot_type=payload.shot_type,
            )
            self.db.add(row)
            records.append(row)

        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError(
                "Duplicate contribution exists for round, hole, shot, and player."
            ) from exc

        for row in records:
            self.db.refresh(row)

        return records

    @staticmethod
    def _ensure_round_editable(round_obj: Round) -> None:
        if round_obj.status == RoundStatus.COMPLETED:
            raise LockedRoundError()
