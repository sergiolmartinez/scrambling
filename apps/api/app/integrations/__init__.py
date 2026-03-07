from functools import lru_cache

from app.core.config import settings
from app.integrations.course_provider import CourseProvider
from app.integrations.golfcourseapi import GolfCourseApiClient, GolfCourseApiProvider


@lru_cache(maxsize=1)
def get_course_provider() -> CourseProvider:
    if not settings.golfcourseapi_api_key:
        raise RuntimeError(
            "GOLFCOURSEAPI_API_KEY is not configured. Set it in .env or apps/api/.env."
        )

    client = GolfCourseApiClient(
        base_url=settings.golfcourseapi_base_url,
        api_key=settings.golfcourseapi_api_key,
        timeout_seconds=settings.golfcourseapi_timeout_seconds,
    )
    return GolfCourseApiProvider(client)
