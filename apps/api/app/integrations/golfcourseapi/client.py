from __future__ import annotations

from dataclasses import dataclass

import httpx
from pydantic import ValidationError as PydanticValidationError

from app.integrations.golfcourseapi.schemas import (
    GolfCourseApiCourse,
)


@dataclass
class GolfCourseApiClientError(Exception):
    message: str


class GolfCourseApiClient:
    def __init__(
        self,
        base_url: str,
        api_key: str,
        timeout_seconds: float,
        transport: httpx.BaseTransport | None = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout_seconds = timeout_seconds
        self.transport = transport

    def search_courses(self, query: str) -> list[GolfCourseApiCourse]:
        payload = self._get_json("/v1/search", params={"search_query": query})
        courses_raw = payload.get("courses")
        if not isinstance(courses_raw, list):
            data_raw = payload.get("data")
            if isinstance(data_raw, dict):
                courses_raw = data_raw.get("courses")

        if not isinstance(courses_raw, list):
            raise GolfCourseApiClientError("Malformed search payload from GolfCourseAPI.")

        parsed_courses: list[GolfCourseApiCourse] = []
        for item in courses_raw:
            if not isinstance(item, dict):
                continue
            try:
                parsed_courses.append(GolfCourseApiCourse.model_validate(self._normalize_course_payload(item)))
            except PydanticValidationError:
                continue

        if not parsed_courses and courses_raw:
            raise GolfCourseApiClientError("Malformed search payload from GolfCourseAPI.")

        return parsed_courses

    def get_course(self, external_id: str) -> GolfCourseApiCourse:
        payload = self._get_json(f"/v1/courses/{external_id}")
        if "course" in payload and isinstance(payload["course"], dict):
            payload = payload["course"]

        normalized = self._normalize_course_payload(payload)
        try:
            return GolfCourseApiCourse.model_validate(normalized)
        except PydanticValidationError as exc:
            raise GolfCourseApiClientError("Malformed course payload from GolfCourseAPI.") from exc

    def _get_json(self, path: str, params: dict[str, str] | None = None) -> dict:
        headers = {"Authorization": f"Key {self.api_key}"}
        try:
            with httpx.Client(
                base_url=self.base_url,
                timeout=self.timeout_seconds,
                transport=self.transport,
            ) as client:
                response = client.get(path, params=params, headers=headers)
        except httpx.TimeoutException as exc:
            raise GolfCourseApiClientError("GolfCourseAPI request timed out.") from exc
        except httpx.HTTPError as exc:
            raise GolfCourseApiClientError("GolfCourseAPI request failed.") from exc

        if response.status_code != 200:
            raise GolfCourseApiClientError(
                f"GolfCourseAPI returned non-200 status: {response.status_code}."
            )

        try:
            payload = response.json()
        except ValueError as exc:
            raise GolfCourseApiClientError("GolfCourseAPI returned non-JSON payload.") from exc

        if not isinstance(payload, dict):
            raise GolfCourseApiClientError("GolfCourseAPI returned unexpected payload structure.")

        return payload

    @staticmethod
    def _normalize_course_payload(payload: dict) -> dict:
        normalized = dict(payload)

        location = normalized.get("location")
        if not isinstance(location, dict):
            normalized["location"] = {}

        tees = normalized.get("tees")
        if isinstance(tees, list):
            normalized["tees"] = {"male": tees, "female": []}
        elif not isinstance(tees, dict):
            normalized["tees"] = {"male": [], "female": []}
        else:
            male = tees.get("male")
            female = tees.get("female")
            normalized["tees"] = {
                "male": male if isinstance(male, list) else [],
                "female": female if isinstance(female, list) else [],
            }

        return normalized
