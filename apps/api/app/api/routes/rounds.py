from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas import (
    CourseAssignRequest,
    CourseCreate,
    CourseRead,
    ErrorResponse,
    HoleScoreRead,
    HoleScoreUpsert,
    RoundCreate,
    RoundPlayerCreate,
    RoundPlayerRead,
    RoundRead,
    ShotContributionCreate,
    ShotContributionRead,
)
from app.services.round_service import RoundService

router = APIRouter(prefix="/rounds", tags=["rounds"])
course_router = APIRouter(prefix="/courses", tags=["courses"])


@router.post("", response_model=RoundRead, status_code=status.HTTP_201_CREATED)
def create_round(payload: RoundCreate, db: Session = Depends(get_db)) -> RoundRead:
    return RoundService(db).create_round(payload)


@router.get("/{round_id}", response_model=RoundRead)
def get_round(round_id: int, db: Session = Depends(get_db)) -> RoundRead:
    return RoundService(db).get_round(round_id)


@router.post(
    "/{round_id}/players", response_model=RoundPlayerRead, status_code=status.HTTP_201_CREATED
)
def add_player(
    round_id: int, payload: RoundPlayerCreate, db: Session = Depends(get_db)
) -> RoundPlayerRead:
    return RoundService(db).add_player(round_id, payload)


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


@course_router.post("", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)) -> CourseRead:
    return RoundService(db).create_course(payload)
