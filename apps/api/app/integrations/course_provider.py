from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class NormalizedCourseSummary:
    external_id: str
    name: str
    city: str | None
    state: str | None
    country: str | None
    total_holes: int
    source: str


@dataclass(frozen=True)
class NormalizedCourseHole:
    hole_number: int
    par: int
    yardage: int | None
    handicap: int | None
    tee_name: str


@dataclass(frozen=True)
class NormalizedCourseDetail:
    external_id: str
    name: str
    city: str | None
    state: str | None
    country: str | None
    total_holes: int
    source: str
    holes: list[NormalizedCourseHole]


class CourseProvider(Protocol):
    def search_courses(self, query: str) -> list[NormalizedCourseSummary]:
        ...

    def get_course_detail(self, external_id: str) -> NormalizedCourseDetail:
        ...

