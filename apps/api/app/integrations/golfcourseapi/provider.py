from __future__ import annotations

from app.integrations.course_provider import (
    CourseProvider,
    NormalizedCourseDetail,
    NormalizedCourseHole,
    NormalizedCourseSummary,
)
from app.integrations.golfcourseapi.client import GolfCourseApiClient
from app.integrations.golfcourseapi.schemas import GolfCourseApiCourse, GolfCourseApiTeeBox


class GolfCourseApiProvider(CourseProvider):
    SOURCE = "golfcourseapi"

    def __init__(self, client: GolfCourseApiClient) -> None:
        self.client = client

    def search_courses(self, query: str) -> list[NormalizedCourseSummary]:
        courses = self.client.search_courses(query)
        return [self._to_summary(course) for course in courses]

    def get_course_detail(self, external_id: str) -> NormalizedCourseDetail:
        course = self.client.get_course(external_id)
        selected_tee = self._select_tee_box(course)
        holes = self._to_holes(selected_tee)
        total_holes = selected_tee.number_of_holes or len(holes) or 18

        return NormalizedCourseDetail(
            external_id=str(course.id),
            name=self._compose_name(course),
            city=course.location.city,
            state=course.location.state,
            country=course.location.country,
            total_holes=total_holes,
            source=self.SOURCE,
            holes=holes,
        )

    def _to_summary(self, course: GolfCourseApiCourse) -> NormalizedCourseSummary:
        selected_tee = self._select_tee_box(course)
        total_holes = selected_tee.number_of_holes or len(selected_tee.holes) or 18
        return NormalizedCourseSummary(
            external_id=str(course.id),
            name=self._compose_name(course),
            city=course.location.city,
            state=course.location.state,
            country=course.location.country,
            total_holes=total_holes,
            source=self.SOURCE,
        )

    @staticmethod
    def _compose_name(course: GolfCourseApiCourse) -> str:
        club_name = (course.club_name or "").strip()
        course_name = (course.course_name or "").strip()
        if club_name and course_name and club_name != course_name:
            return f"{club_name} - {course_name}"
        if club_name:
            return club_name
        if course_name:
            return course_name
        return f"Golf Course {course.id}"

    @staticmethod
    def _select_tee_box(course: GolfCourseApiCourse) -> GolfCourseApiTeeBox:
        if course.tees.male:
            return course.tees.male[0]
        if course.tees.female:
            return course.tees.female[0]
        return GolfCourseApiTeeBox(tee_name="default", number_of_holes=18, holes=[])

    @staticmethod
    def _to_holes(tee_box: GolfCourseApiTeeBox) -> list[NormalizedCourseHole]:
        tee_name = (tee_box.tee_name or "default").strip() or "default"
        holes: list[NormalizedCourseHole] = []
        for index, hole in enumerate(tee_box.holes):
            holes.append(
                NormalizedCourseHole(
                    hole_number=index + 1,
                    par=hole.par or 4,
                    yardage=hole.yardage,
                    handicap=hole.handicap,
                    tee_name=tee_name,
                )
            )
        return holes

