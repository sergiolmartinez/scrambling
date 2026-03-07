from __future__ import annotations

from app.integrations.course_provider import (
    NormalizedCourseDetail,
    NormalizedCourseHole,
    NormalizedCourseSummary,
)
from app.integrations.golfcourseapi.schemas import GolfCourseApiCourse, GolfCourseApiTeeBox

SOURCE = "golfcourseapi"


def to_summary(course: GolfCourseApiCourse) -> NormalizedCourseSummary:
    selected_tee = select_tee_box(course)
    total_holes = selected_tee.number_of_holes or len(selected_tee.holes) or 18
    return NormalizedCourseSummary(
        external_id=str(course.id),
        name=compose_name(course),
        city=course.location.city,
        state=course.location.state,
        country=course.location.country,
        total_holes=total_holes,
        source=SOURCE,
    )


def to_detail(course: GolfCourseApiCourse) -> NormalizedCourseDetail:
    tee_boxes = list_tee_boxes(course)
    holes: list[NormalizedCourseHole] = []
    seen_tee_names: dict[str, int] = {}
    for tee_box in tee_boxes:
        base_name = (tee_box.tee_name or "default").strip() or "default"
        seen_tee_names[base_name] = seen_tee_names.get(base_name, 0) + 1
        suffix = seen_tee_names[base_name]
        unique_tee_name = base_name if suffix == 1 else f"{base_name}-{suffix}"
        holes.extend(to_holes(tee_box, tee_name_override=unique_tee_name))

    selected_tee = tee_boxes[0]
    total_holes = selected_tee.number_of_holes or len(selected_tee.holes) or 18

    return NormalizedCourseDetail(
        external_id=str(course.id),
        name=compose_name(course),
        city=course.location.city,
        state=course.location.state,
        country=course.location.country,
        total_holes=total_holes,
        source=SOURCE,
        holes=holes,
    )


def compose_name(course: GolfCourseApiCourse) -> str:
    club_name = (course.club_name or "").strip()
    course_name = (course.course_name or "").strip()
    if club_name and course_name and club_name != course_name:
        return f"{club_name} - {course_name}"
    if club_name:
        return club_name
    if course_name:
        return course_name
    return f"Golf Course {course.id}"


def select_tee_box(course: GolfCourseApiCourse) -> GolfCourseApiTeeBox:
    return list_tee_boxes(course)[0]


def list_tee_boxes(course: GolfCourseApiCourse) -> list[GolfCourseApiTeeBox]:
    # Keep stable ordering: male tees first, then female tees, preserving provider order.
    # This gives deterministic snapshots and avoids churn between repeated imports.
    tee_boxes = [*course.tees.male, *course.tees.female]
    if tee_boxes:
        return tee_boxes

    return [GolfCourseApiTeeBox(tee_name="default", number_of_holes=18, holes=[])]


def to_holes(
    tee_box: GolfCourseApiTeeBox,
    tee_name_override: str | None = None,
) -> list[NormalizedCourseHole]:
    # Provider holes do not include an explicit hole_number.
    # Derive sequence as index + 1 to guarantee contiguous 1..N numbering per tee set.
    tee_name = tee_name_override or (tee_box.tee_name or "default").strip() or "default"
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
