import json

import httpx

from app.integrations.golfcourseapi.client import GolfCourseApiClient, GolfCourseApiClientError


def test_search_courses_success_and_header_format() -> None:
    captured_auth: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        captured_auth.append(request.headers.get("Authorization", ""))
        return httpx.Response(
            200,
            json={
                "courses": [
                    {
                        "id": 991,
                        "club_name": "Pine Hills Club",
                        "course_name": "Championship",
                        "location": {"city": "Denver", "state": "CO", "country": "USA"},
                    }
                ]
            },
        )

    transport = httpx.MockTransport(handler)
    client = GolfCourseApiClient(
        base_url="https://api.golfcourseapi.com",
        api_key="abc123",
        timeout_seconds=3.0,
        transport=transport,
    )

    courses = client.search_courses("pine")
    assert len(courses) == 1
    assert courses[0].id == 991
    assert captured_auth == ["Key abc123"]


def test_get_course_non_200_returns_clean_error() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(401, json={"error": "API key is missing or invalid"})

    client = GolfCourseApiClient(
        base_url="https://api.golfcourseapi.com",
        api_key="bad",
        timeout_seconds=3.0,
        transport=httpx.MockTransport(handler),
    )

    try:
        client.get_course("991")
        raised = False
    except GolfCourseApiClientError as exc:
        raised = True
        assert "non-200" in exc.message

    assert raised


def test_get_course_malformed_payload_returns_clean_error() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(200, content=json.dumps(["unexpected", "payload"]))

    client = GolfCourseApiClient(
        base_url="https://api.golfcourseapi.com",
        api_key="abc123",
        timeout_seconds=3.0,
        transport=httpx.MockTransport(handler),
    )

    try:
        client.get_course("991")
        raised = False
    except GolfCourseApiClientError as exc:
        raised = True
        assert "unexpected payload structure" in exc.message.lower()

    assert raised


def test_get_course_accepts_wrapped_payload_and_null_blocks() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "course": {
                    "id": 19695,
                    "club_name": "Dublin Ranch",
                    "course_name": "Dublin Ranch",
                    "location": None,
                    "tees": None,
                }
            },
        )

    client = GolfCourseApiClient(
        base_url="https://api.golfcourseapi.com",
        api_key="abc123",
        timeout_seconds=3.0,
        transport=httpx.MockTransport(handler),
    )

    course = client.get_course("19695")
    assert course.id == 19695
    assert course.location.city is None
