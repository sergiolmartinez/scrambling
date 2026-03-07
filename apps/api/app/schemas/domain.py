from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, model_validator


class RoundStatus(str, Enum):
    draft = "draft"
    active = "active"
    completed = "completed"


class CourseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    external_course_id: str | None = Field(default=None, max_length=128)
    city: str | None = Field(default=None, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)
    total_holes: int = Field(default=18, ge=1, le=36)
    source: str = Field(default="manual", min_length=1, max_length=64)


class CourseHoleRead(BaseModel):
    id: int
    hole_number: int
    par: int
    yardage: int | None
    handicap: int | None
    tee_name: str

    model_config = {"from_attributes": True}


class CourseRead(BaseModel):
    id: int
    external_course_id: str | None
    name: str
    city: str | None
    state: str | None
    country: str | None
    total_holes: int
    source: str

    model_config = {"from_attributes": True}


class CourseDetailRead(CourseRead):
    holes: list[CourseHoleRead]


class CourseAssignRequest(BaseModel):
    course_id: int


class RoundCreate(BaseModel):
    notes: str | None = Field(default=None, max_length=500)


class RoundRead(BaseModel):
    id: int
    status: RoundStatus
    course_id: int | None
    started_at: datetime | None
    completed_at: datetime | None
    notes: str | None

    model_config = {"from_attributes": True}


class RoundPlayerCreate(BaseModel):
    display_name: str = Field(min_length=1, max_length=120)
    sort_order: int = Field(ge=1, le=4)


class RoundPlayerUpdate(BaseModel):
    display_name: str | None = Field(default=None, min_length=1, max_length=120)
    sort_order: int | None = Field(default=None, ge=1, le=4)


class RoundPlayerRead(BaseModel):
    id: int
    round_id: int
    display_name: str
    sort_order: int

    model_config = {"from_attributes": True}


class HoleScoreUpsert(BaseModel):
    score: int | None = Field(default=None, ge=1, le=20)
    par_snapshot: int | None = Field(default=None, ge=1, le=10)
    completed: bool = False


class HoleScoreRead(BaseModel):
    id: int
    round_id: int
    hole_number: int
    score: int | None
    par_snapshot: int | None
    completed: bool

    model_config = {"from_attributes": True}


class ShotContributionCreate(BaseModel):
    shot_number: int = Field(ge=1, le=20)
    round_player_ids: list[int] | None = None
    player_ids: list[int] | None = None
    shot_type: str | None = Field(default=None, max_length=64)

    @model_validator(mode="after")
    def validate_player_ids(self) -> "ShotContributionCreate":
        if not self.round_player_ids and not self.player_ids:
            raise ValueError("round_player_ids or player_ids is required")
        return self


class ShotContributionRead(BaseModel):
    id: int
    round_id: int
    hole_number: int
    shot_number: int
    round_player_id: int
    shot_type: str | None

    model_config = {"from_attributes": True}


class LeaderboardEntryRead(BaseModel):
    round_player_id: int
    display_name: str
    total_contributions: int


class RoundAggregateRead(BaseModel):
    round: RoundRead
    course: CourseRead | None
    players: list[RoundPlayerRead]
    hole_scores: list[HoleScoreRead]
    contributions: list[ShotContributionRead]


class RoundSummaryRead(BaseModel):
    round: RoundRead
    course: CourseRead | None
    players: list[RoundPlayerRead]
    hole_scores: list[HoleScoreRead]
    leaderboard: list[LeaderboardEntryRead]


class ErrorResponse(BaseModel):
    code: str
    message: str
    details: dict[str, str] | None = None
