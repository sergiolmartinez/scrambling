from __future__ import annotations

from pydantic import BaseModel, Field


class GolfCourseApiHole(BaseModel):
    par: int | None = None
    yardage: int | None = None
    handicap: int | None = None


class GolfCourseApiTeeBox(BaseModel):
    tee_name: str | None = None
    number_of_holes: int | None = None
    holes: list[GolfCourseApiHole] = Field(default_factory=list)


class GolfCourseApiTees(BaseModel):
    female: list[GolfCourseApiTeeBox] = Field(default_factory=list)
    male: list[GolfCourseApiTeeBox] = Field(default_factory=list)


class GolfCourseApiLocation(BaseModel):
    city: str | None = None
    state: str | None = None
    country: str | None = None


class GolfCourseApiCourse(BaseModel):
    id: int
    club_name: str | None = None
    course_name: str | None = None
    location: GolfCourseApiLocation = Field(default_factory=GolfCourseApiLocation)
    tees: GolfCourseApiTees = Field(default_factory=GolfCourseApiTees)


class GolfCourseApiSearchResponse(BaseModel):
    courses: list[GolfCourseApiCourse] = Field(default_factory=list)

