from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models import User
from app.schemas import (
    CourseAssignRequest,
    CourseCreate,
    CourseDetailRead,
    CourseImportRequest,
    CourseRead,
    ErrorResponse,
    ExternalCourseDetailRead,
    ExternalCourseSearchRead,
    HoleScoreRead,
    HoleScoreUpsert,
    LeaderboardEntryRead,
    RoundAggregateRead,
    RoundCreate,
    RoundPlayerCreate,
    RoundPlayerRead,
    RoundPlayerUpdate,
    RoundRead,
    RoundSummaryRead,
    ShotContributionCreate,
    ShotContributionRead,
)
from app.services.round_service import RoundService

router = APIRouter(prefix="/rounds", tags=["rounds"])
course_router = APIRouter(prefix="/courses", tags=["courses"])

DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


def get_round_service(db: DbSession, current_user: CurrentUser) -> RoundService:
    return RoundService(db, current_user=current_user)


RoundServiceDep = Annotated[RoundService, Depends(get_round_service)]


@router.post("", response_model=RoundRead, status_code=status.HTTP_201_CREATED)
def create_round(payload: RoundCreate, round_service: RoundServiceDep) -> RoundRead:
    return round_service.create_round(payload)


@router.get("/{round_id}", response_model=RoundAggregateRead)
def get_round(round_id: int, round_service: RoundServiceDep) -> RoundAggregateRead:
    return round_service.get_round_aggregate(round_id)


@router.post(
    "/{round_id}/players", response_model=RoundPlayerRead, status_code=status.HTTP_201_CREATED
)
def add_player(
    round_id: int,
    payload: RoundPlayerCreate,
    round_service: RoundServiceDep,
) -> RoundPlayerRead:
    return round_service.add_player(round_id, payload)


@router.patch("/{round_id}/players/{player_id}", response_model=RoundPlayerRead)
def update_player(
    round_id: int,
    player_id: int,
    payload: RoundPlayerUpdate,
    round_service: RoundServiceDep,
) -> RoundPlayerRead:
    return round_service.update_player(round_id, player_id, payload)


@router.delete("/{round_id}/players/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(round_id: int, player_id: int, round_service: RoundServiceDep) -> None:
    round_service.delete_player(round_id, player_id)


@router.post("/{round_id}/complete", response_model=RoundRead)
def complete_round(round_id: int, round_service: RoundServiceDep) -> RoundRead:
    return round_service.complete_round(round_id)


@router.post("/{round_id}/course", response_model=RoundRead)
def assign_course(
    round_id: int,
    payload: CourseAssignRequest,
    round_service: RoundServiceDep,
) -> RoundRead:
    return round_service.assign_course(round_id, payload)


@router.post("/{round_id}/course/import", response_model=RoundRead)
def import_course_and_assign(
    round_id: int,
    payload: CourseImportRequest,
    round_service: RoundServiceDep,
) -> RoundRead:
    return round_service.import_course_and_assign_round(round_id, payload)


@router.put("/{round_id}/holes/{hole_number}", response_model=HoleScoreRead)
def upsert_hole_score(
    round_id: int,
    hole_number: int,
    payload: HoleScoreUpsert,
    round_service: RoundServiceDep,
) -> HoleScoreRead:
    return round_service.upsert_hole_score(round_id, hole_number, payload)


@router.post(
    "/{round_id}/holes/{hole_number}/shots",
    response_model=list[ShotContributionRead],
    status_code=status.HTTP_201_CREATED,
    responses={status.HTTP_409_CONFLICT: {"model": ErrorResponse}},
)
def add_shot_contributions(
    round_id: int,
    hole_number: int,
    payload: ShotContributionCreate,
    round_service: RoundServiceDep,
) -> list[ShotContributionRead]:
    return round_service.add_shot_contributions(round_id, hole_number, payload)


@router.get("/{round_id}/holes/{hole_number}/shots", response_model=list[ShotContributionRead])
def get_hole_shot_contributions(
    round_id: int,
    hole_number: int,
    round_service: RoundServiceDep,
) -> list[ShotContributionRead]:
    return round_service.get_hole_contributions(round_id, hole_number)


@router.delete(
    "/{round_id}/holes/{hole_number}/shots/{shot_number}/players/{player_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_shot_contribution(
    round_id: int,
    hole_number: int,
    shot_number: int,
    player_id: int,
    round_service: RoundServiceDep,
) -> None:
    round_service.delete_contribution(round_id, hole_number, shot_number, player_id)


@router.get("/{round_id}/leaderboard", response_model=list[LeaderboardEntryRead])
def get_leaderboard(
    round_id: int, round_service: RoundServiceDep
) -> list[LeaderboardEntryRead]:
    return round_service.get_leaderboard(round_id)


@router.get("/{round_id}/summary", response_model=RoundSummaryRead)
def get_round_summary(round_id: int, round_service: RoundServiceDep) -> RoundSummaryRead:
    return round_service.get_round_summary(round_id)


@course_router.post("", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, round_service: RoundServiceDep) -> CourseRead:
    return round_service.create_course(payload)


@course_router.get("/search", response_model=list[ExternalCourseSearchRead])
def search_courses(q: str, round_service: RoundServiceDep) -> list[ExternalCourseSearchRead]:
    return round_service.search_courses(q)


@course_router.get("/external/{external_id}", response_model=ExternalCourseDetailRead)
def get_external_course_detail(
    external_id: str, round_service: RoundServiceDep
) -> ExternalCourseDetailRead:
    return round_service.get_external_course_detail(external_id)


@course_router.get("/{course_id}", response_model=CourseDetailRead)
def get_course_detail(course_id: int, round_service: RoundServiceDep) -> CourseDetailRead:
    return round_service.get_course_detail(course_id)
