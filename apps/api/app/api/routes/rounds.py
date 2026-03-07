from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas import (
    CourseAssignRequest,
    CourseCreate,
    CourseDetailRead,
    CourseRead,
    ErrorResponse,
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


@router.post("", response_model=RoundRead, status_code=status.HTTP_201_CREATED)
def create_round(payload: RoundCreate, db: Session = Depends(get_db)) -> RoundRead:
    return RoundService(db).create_round(payload)


@router.get("/{round_id}", response_model=RoundAggregateRead)
def get_round(round_id: int, db: Session = Depends(get_db)) -> RoundAggregateRead:
    return RoundService(db).get_round_aggregate(round_id)


@router.post(
    "/{round_id}/players", response_model=RoundPlayerRead, status_code=status.HTTP_201_CREATED
)
def add_player(
    round_id: int, payload: RoundPlayerCreate, db: Session = Depends(get_db)
) -> RoundPlayerRead:
    return RoundService(db).add_player(round_id, payload)


@router.patch("/{round_id}/players/{player_id}", response_model=RoundPlayerRead)
def update_player(
    round_id: int,
    player_id: int,
    payload: RoundPlayerUpdate,
    db: Session = Depends(get_db),
) -> RoundPlayerRead:
    return RoundService(db).update_player(round_id, player_id, payload)


@router.delete("/{round_id}/players/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(round_id: int, player_id: int, db: Session = Depends(get_db)) -> None:
    RoundService(db).delete_player(round_id, player_id)


@router.post("/{round_id}/complete", response_model=RoundRead)
def complete_round(round_id: int, db: Session = Depends(get_db)) -> RoundRead:
    return RoundService(db).complete_round(round_id)


@router.post("/{round_id}/course", response_model=RoundRead)
def assign_course(
    round_id: int,
    payload: CourseAssignRequest,
    db: Session = Depends(get_db),
) -> RoundRead:
    return RoundService(db).assign_course(round_id, payload)


@router.put("/{round_id}/holes/{hole_number}", response_model=HoleScoreRead)
def upsert_hole_score(
    round_id: int,
    hole_number: int,
    payload: HoleScoreUpsert,
    db: Session = Depends(get_db),
) -> HoleScoreRead:
    return RoundService(db).upsert_hole_score(round_id, hole_number, payload)


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
    db: Session = Depends(get_db),
) -> list[ShotContributionRead]:
    return RoundService(db).add_shot_contributions(round_id, hole_number, payload)


@router.get("/{round_id}/holes/{hole_number}/shots", response_model=list[ShotContributionRead])
def get_hole_shot_contributions(
    round_id: int,
    hole_number: int,
    db: Session = Depends(get_db),
) -> list[ShotContributionRead]:
    return RoundService(db).get_hole_contributions(round_id, hole_number)


@router.delete(
    "/{round_id}/holes/{hole_number}/shots/{shot_number}/players/{player_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_shot_contribution(
    round_id: int,
    hole_number: int,
    shot_number: int,
    player_id: int,
    db: Session = Depends(get_db),
) -> None:
    RoundService(db).delete_contribution(round_id, hole_number, shot_number, player_id)


@router.get("/{round_id}/leaderboard", response_model=list[LeaderboardEntryRead])
def get_leaderboard(round_id: int, db: Session = Depends(get_db)) -> list[LeaderboardEntryRead]:
    return RoundService(db).get_leaderboard(round_id)


@router.get("/{round_id}/summary", response_model=RoundSummaryRead)
def get_round_summary(round_id: int, db: Session = Depends(get_db)) -> RoundSummaryRead:
    return RoundService(db).get_round_summary(round_id)


@course_router.post("", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)) -> CourseRead:
    return RoundService(db).create_course(payload)


@course_router.get("/search", response_model=list[CourseRead])
def search_courses(q: str, db: Session = Depends(get_db)) -> list[CourseRead]:
    return RoundService(db).search_courses(q)


@course_router.get("/{course_id}", response_model=CourseDetailRead)
def get_course_detail(course_id: int, db: Session = Depends(get_db)) -> CourseDetailRead:
    return RoundService(db).get_course_detail(course_id)
