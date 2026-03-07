from datetime import UTC, datetime

from sqlalchemy import Select, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.integrations.course_provider import CourseProvider
from app.models import (
    Course,
    HoleScore,
    Round,
    RoundPlayer,
    RoundStatus,
    ShotContribution,
)
from app.schemas import (
    CourseAssignRequest,
    CourseCreate,
    CourseImportRequest,
    ExternalCourseDetailRead,
    ExternalCourseSearchRead,
    HoleScoreUpsert,
    LeaderboardEntryRead,
    RoundAggregateRead,
    RoundCreate,
    RoundPlayerCreate,
    RoundPlayerUpdate,
    RoundSummaryRead,
    ShotContributionCreate,
)
from app.services.course_import_service import CourseImportService
from app.services.errors import (
    ConflictError,
    LockedRoundError,
    NotFoundError,
    ValidationError,
)


class RoundService:
    def __init__(
        self, db: Session, course_provider: CourseProvider | None = None
    ) -> None:
        self.db = db
        self.course_import_service = CourseImportService(db, course_provider=course_provider)

    def create_course(self, payload: CourseCreate) -> Course:
        course = Course(**payload.model_dump())
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def search_courses(self, q: str) -> list[ExternalCourseSearchRead]:
        return self.course_import_service.search_courses(q)

    def get_course_detail(self, course_id: int) -> Course:
        stmt = select(Course).where(Course.id == course_id).options(selectinload(Course.holes))
        course = self.db.execute(stmt).scalar_one_or_none()
        if course is None:
            raise NotFoundError("Course not found.", {"course_id": str(course_id)})

        return self.course_import_service.hydrate_course_if_needed(course)

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

    def get_round_aggregate(self, round_id: int) -> RoundAggregateRead:
        round_obj = self.get_round(round_id)
        return RoundAggregateRead(
            round=round_obj,
            course=round_obj.course,
            players=self._get_round_players(round_id),
            hole_scores=self._get_round_hole_scores(round_id),
            contributions=self._get_round_contributions(round_id),
        )

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

    def get_external_course_detail(self, external_id: str) -> ExternalCourseDetailRead:
        return self.course_import_service.get_external_course_detail(external_id)

    def import_course_and_assign_round(
        self, round_id: int, payload: CourseImportRequest
    ) -> Round:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        course = self.course_import_service.import_course_snapshot(payload.external_id)

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

    def update_player(
        self, round_id: int, player_id: int, payload: RoundPlayerUpdate
    ) -> RoundPlayer:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        player = self._get_player(round_id, player_id)
        if payload.display_name is not None:
            player.display_name = payload.display_name.strip()
        if payload.sort_order is not None:
            player.sort_order = payload.sort_order

        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError("Player sort order must be unique within a round.") from exc

        self.db.refresh(player)
        return player

    def delete_player(self, round_id: int, player_id: int) -> None:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        count = self.db.scalar(
            select(func.count(RoundPlayer.id)).where(RoundPlayer.round_id == round_id)
        )
        if count is not None and count <= 1:
            raise ValidationError("A round must keep at least 1 player.")

        player = self._get_player(round_id, player_id)
        self.db.delete(player)
        self.db.commit()

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

        self._activate_round_if_needed(round_obj)
        self.db.commit()
        self.db.refresh(hole_score)
        return hole_score

    def add_shot_contributions(
        self, round_id: int, hole_number: int, payload: ShotContributionCreate
    ) -> list[ShotContribution]:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        input_ids = payload.round_player_ids or payload.player_ids or []
        player_ids = sorted(set(input_ids))
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
            self._activate_round_if_needed(round_obj)
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError(
                "Duplicate contribution exists for round, hole, shot, and player."
            ) from exc

        for row in records:
            self.db.refresh(row)

        return records

    def get_hole_contributions(self, round_id: int, hole_number: int) -> list[ShotContribution]:
        self.get_round(round_id)
        stmt = (
            select(ShotContribution)
            .where(
                ShotContribution.round_id == round_id,
                ShotContribution.hole_number == hole_number,
            )
            .order_by(ShotContribution.shot_number.asc(), ShotContribution.round_player_id.asc())
        )
        return self.db.execute(stmt).scalars().all()

    def delete_contribution(
        self,
        round_id: int,
        hole_number: int,
        shot_number: int,
        player_id: int,
    ) -> None:
        round_obj = self.get_round(round_id)
        self._ensure_round_editable(round_obj)

        stmt = select(ShotContribution).where(
            ShotContribution.round_id == round_id,
            ShotContribution.hole_number == hole_number,
            ShotContribution.shot_number == shot_number,
            ShotContribution.round_player_id == player_id,
        )
        row = self.db.execute(stmt).scalar_one_or_none()
        if row is None:
            raise NotFoundError(
                "Shot contribution not found.",
                {
                    "round_id": str(round_id),
                    "hole_number": str(hole_number),
                    "shot_number": str(shot_number),
                    "player_id": str(player_id),
                },
            )

        self.db.delete(row)
        self.db.commit()

    def get_leaderboard(self, round_id: int) -> list[LeaderboardEntryRead]:
        self.get_round(round_id)

        stmt = (
            select(
                RoundPlayer.id,
                RoundPlayer.display_name,
                func.count(ShotContribution.id).label("total_contributions"),
            )
            .outerjoin(ShotContribution, ShotContribution.round_player_id == RoundPlayer.id)
            .where(RoundPlayer.round_id == round_id)
            .group_by(RoundPlayer.id, RoundPlayer.display_name)
            .order_by(func.count(ShotContribution.id).desc(), RoundPlayer.sort_order.asc())
        )

        return [
            LeaderboardEntryRead(
                round_player_id=row[0],
                display_name=row[1],
                total_contributions=row[2],
            )
            for row in self.db.execute(stmt).all()
        ]

    def get_round_summary(self, round_id: int) -> RoundSummaryRead:
        round_obj = self.get_round(round_id)
        return RoundSummaryRead(
            round=round_obj,
            course=round_obj.course,
            players=self._get_round_players(round_id),
            hole_scores=self._get_round_hole_scores(round_id),
            leaderboard=self.get_leaderboard(round_id),
        )

    def _get_player(self, round_id: int, player_id: int) -> RoundPlayer:
        stmt = select(RoundPlayer).where(
            RoundPlayer.round_id == round_id, RoundPlayer.id == player_id
        )
        player = self.db.execute(stmt).scalar_one_or_none()
        if player is None:
            raise NotFoundError(
                "Player not found.",
                {"round_id": str(round_id), "player_id": str(player_id)},
            )
        return player

    def _get_round_players(self, round_id: int) -> list[RoundPlayer]:
        stmt = (
            select(RoundPlayer)
            .where(RoundPlayer.round_id == round_id)
            .order_by(RoundPlayer.sort_order.asc())
        )
        return self.db.execute(stmt).scalars().all()

    def _get_round_hole_scores(self, round_id: int) -> list[HoleScore]:
        stmt = (
            select(HoleScore)
            .where(HoleScore.round_id == round_id)
            .order_by(HoleScore.hole_number.asc())
        )
        return self.db.execute(stmt).scalars().all()

    def _get_round_contributions(self, round_id: int) -> list[ShotContribution]:
        stmt = (
            select(ShotContribution)
            .where(ShotContribution.round_id == round_id)
            .order_by(ShotContribution.hole_number.asc(), ShotContribution.shot_number.asc())
        )
        return self.db.execute(stmt).scalars().all()

    @staticmethod
    def _activate_round_if_needed(round_obj: Round) -> None:
        if round_obj.status == RoundStatus.DRAFT:
            round_obj.status = RoundStatus.ACTIVE
            if round_obj.started_at is None:
                round_obj.started_at = datetime.now(UTC)

    @staticmethod
    def _ensure_round_editable(round_obj: Round) -> None:
        if round_obj.status == RoundStatus.COMPLETED:
            raise LockedRoundError()
