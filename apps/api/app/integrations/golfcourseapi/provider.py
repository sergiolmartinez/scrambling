from __future__ import annotations

from app.integrations.course_provider import (
    CourseProvider,
    NormalizedCourseDetail,
    NormalizedCourseSummary,
)
from app.integrations.golfcourseapi.client import GolfCourseApiClient
from app.integrations.golfcourseapi.mapper import to_detail, to_summary


class GolfCourseApiProvider(CourseProvider):
    def __init__(self, client: GolfCourseApiClient) -> None:
        self.client = client

    def search_courses(self, query: str) -> list[NormalizedCourseSummary]:
        courses = self.client.search_courses(query)
        return [to_summary(course) for course in courses]

    def get_course_detail(self, external_id: str) -> NormalizedCourseDetail:
        course = self.client.get_course(external_id)
        return to_detail(course)
