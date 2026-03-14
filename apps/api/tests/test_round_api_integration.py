import pytest
from fastapi.testclient import TestClient

from app.integrations.course_provider import (
    NormalizedCourseDetail,
    NormalizedCourseHole,
    NormalizedCourseSummary,
)
from app.integrations.golfcourseapi import GolfCourseApiClientError
from app.models import Round


class StubCourseProvider:
    def __init__(self) -> None:
        self.raise_error = False
        self.detail_calls = 0

    def search_courses(self, query: str) -> list[NormalizedCourseSummary]:
        if self.raise_error:
            raise RuntimeError("provider failure")
        return [
            NormalizedCourseSummary(
                external_id="991",
                name="Pine Hills",
                city="Denver",
                state="CO",
                country="USA",
                total_holes=18,
                source="golfcourseapi",
            )
        ]

    def get_course_detail(self, external_id: str) -> NormalizedCourseDetail:
        if self.raise_error:
            raise RuntimeError("provider failure")
        self.detail_calls += 1
        return NormalizedCourseDetail(
            external_id=external_id,
            name="Pine Hills",
            city="Denver",
            state="CO",
            country="USA",
            total_holes=18,
            source="golfcourseapi",
            holes=[
                NormalizedCourseHole(
                    hole_number=1,
                    par=4,
                    yardage=410,
                    handicap=8,
                    tee_name="Blue",
                ),
                NormalizedCourseHole(
                    hole_number=2,
                    par=3,
                    yardage=175,
                    handicap=16,
                    tee_name="Blue",
                ),
            ],
        )


@pytest.fixture(autouse=True)
def authenticate_client(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "round-tests@example.com",
            "display_name": "Round Tests",
            "password": "supersecure123",
        },
    )
    assert response.status_code == 201


def test_round_lifecycle_and_player_management(client: TestClient) -> None:
    created_round = client.post("/api/v1/rounds", json={}).json()
    round_id = created_round["id"]

    p1 = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )
    p2 = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Bob", "sort_order": 2},
    )
    assert p1.status_code == 201
    assert p2.status_code == 201

    player_2_id = p2.json()["id"]
    updated = client.patch(
        f"/api/v1/rounds/{round_id}/players/{player_2_id}",
        json={"display_name": "Bobby", "sort_order": 2},
    )
    assert updated.status_code == 200
    assert updated.json()["display_name"] == "Bobby"

    deleted = client.delete(f"/api/v1/rounds/{round_id}/players/{player_2_id}")
    assert deleted.status_code == 204

    completed = client.post(f"/api/v1/rounds/{round_id}/complete")
    assert completed.status_code == 200
    assert completed.json()["status"] == "completed"

    locked_response = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Late", "sort_order": 2},
    )
    assert locked_response.status_code == 423


def test_new_round_is_owned_by_authenticated_user(client: TestClient, db_session) -> None:
    me = client.get("/api/v1/auth/me")
    assert me.status_code == 200
    user_id = me.json()["id"]

    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]

    round_obj = db_session.get(Round, round_id)
    assert round_obj is not None
    assert round_obj.owner_user_id == user_id


def test_course_search_detail_assign_and_round_aggregate(client: TestClient, monkeypatch) -> None:
    provider = StubCourseProvider()
    monkeypatch.setattr("app.services.course_import_service.get_course_provider", lambda: provider)

    search = client.get("/api/v1/courses/search?q=Pine")
    assert search.status_code == 200
    assert search.json()[0]["external_id"] == "991"

    detail = client.get("/api/v1/courses/external/991")
    assert detail.status_code == 200
    assert detail.json()["holes"][0]["par"] == 4

    created_manual_course = client.post(
        "/api/v1/courses",
        json={
            "name": "Pebble Beach Golf Links",
            "city": "Pebble Beach",
            "state": "CA",
            "country": "USA",
            "total_holes": 18,
            "source": "manual",
        },
    )
    assert created_manual_course.status_code == 201
    manual_course_id = created_manual_course.json()["id"]

    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]
    client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )

    imported_assignment = client.post(
        f"/api/v1/rounds/{round_id}/course/import",
        json={"external_id": "991"},
    )
    assert imported_assignment.status_code == 200

    assigned_manual = client.post(
        f"/api/v1/rounds/{round_id}/course", json={"course_id": manual_course_id}
    )
    assert assigned_manual.status_code == 200
    assert assigned_manual.json()["course_id"] == manual_course_id

    external_course_id = imported_assignment.json()["course_id"]
    external_detail = client.get(f"/api/v1/courses/{external_course_id}")
    assert external_detail.status_code == 200
    assert external_detail.json()["source"] == "golfcourseapi"

    assigned = client.post(
        f"/api/v1/rounds/{round_id}/course", json={"course_id": external_course_id}
    )
    assert assigned.status_code == 200
    assert assigned.json()["course_id"] == external_course_id

    aggregate = client.get(f"/api/v1/rounds/{round_id}")
    assert aggregate.status_code == 200
    payload = aggregate.json()
    assert payload["course"]["id"] == external_course_id
    assert len(payload["players"]) == 1


def test_course_search_rejects_short_queries(client: TestClient) -> None:
    response = client.get("/api/v1/courses/search?q=a")
    assert response.status_code == 400
    assert response.json()["code"] == "validation_error"


def test_scoring_contributions_leaderboard_and_summary(client: TestClient) -> None:
    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]

    p1 = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    ).json()
    p2 = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Bob", "sort_order": 2},
    ).json()

    hole_score = client.put(
        f"/api/v1/rounds/{round_id}/holes/1",
        json={"score": 4, "par_snapshot": 4, "completed": True},
    )
    assert hole_score.status_code == 200

    add_shot = client.post(
        f"/api/v1/rounds/{round_id}/holes/1/shots",
        json={"shot_number": 1, "round_player_ids": [p1["id"], p2["id"]], "shot_type": "drive"},
    )
    assert add_shot.status_code == 201
    assert len(add_shot.json()) == 2

    list_shots = client.get(f"/api/v1/rounds/{round_id}/holes/1/shots")
    assert list_shots.status_code == 200
    assert len(list_shots.json()) == 2

    leaderboard = client.get(f"/api/v1/rounds/{round_id}/leaderboard")
    assert leaderboard.status_code == 200
    assert leaderboard.json()[0]["total_contributions"] == 1

    delete_one = client.delete(f"/api/v1/rounds/{round_id}/holes/1/shots/1/players/{p2['id']}")
    assert delete_one.status_code == 204

    summary = client.get(f"/api/v1/rounds/{round_id}/summary")
    assert summary.status_code == 200
    assert len(summary.json()["hole_scores"]) == 1
    assert len(summary.json()["leaderboard"]) == 2


def test_completed_round_rejects_mutations_across_setup_and_scoring(client: TestClient) -> None:
    course = client.post(
        "/api/v1/courses",
        json={
            "name": "Locked Test Course",
            "city": "Austin",
            "state": "TX",
            "country": "USA",
            "total_holes": 18,
            "source": "manual",
        },
    ).json()

    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]

    player_one = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    ).json()
    player_two = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Bob", "sort_order": 2},
    ).json()
    client.post(
        f"/api/v1/rounds/{round_id}/holes/1/shots",
        json={"shot_number": 1, "round_player_ids": [player_one["id"]]},
    )

    completed = client.post(f"/api/v1/rounds/{round_id}/complete")
    assert completed.status_code == 200

    assert (
        client.post(
            f"/api/v1/rounds/{round_id}/course", json={"course_id": course["id"]}
        ).status_code
        == 423
    )
    assert (
        client.post(
            f"/api/v1/rounds/{round_id}/players",
            json={"display_name": "Charlie", "sort_order": 3},
        ).status_code
        == 423
    )
    assert (
        client.patch(
            f"/api/v1/rounds/{round_id}/players/{player_one['id']}",
            json={"display_name": "Renamed"},
        ).status_code
        == 423
    )
    assert client.delete(
        f"/api/v1/rounds/{round_id}/players/{player_two['id']}"
    ).status_code == 423
    assert (
        client.put(
            f"/api/v1/rounds/{round_id}/holes/1",
            json={"score": 4, "par_snapshot": 4, "completed": True},
        ).status_code
        == 423
    )
    assert (
        client.post(
            f"/api/v1/rounds/{round_id}/holes/1/shots",
            json={"shot_number": 1, "round_player_ids": [player_one["id"]]},
        ).status_code
        == 423
    )
    assert (
        client.delete(
            f"/api/v1/rounds/{round_id}/holes/1/shots/1/players/{player_one['id']}"
        ).status_code
        == 423
    )


def test_complete_round_requires_at_least_one_player(client: TestClient) -> None:
    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]

    response = client.post(f"/api/v1/rounds/{round_id}/complete")
    assert response.status_code == 400
    assert response.json()["code"] == "validation_error"


def test_delete_missing_contribution_returns_not_found(client: TestClient) -> None:
    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]
    player = client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    ).json()

    response = client.delete(
        f"/api/v1/rounds/{round_id}/holes/1/shots/3/players/{player['id']}"
    )
    assert response.status_code == 404
    assert response.json()["code"] == "not_found"


def test_provider_failure_returns_clean_error(client: TestClient, monkeypatch) -> None:
    provider = StubCourseProvider()
    provider.raise_error = True
    monkeypatch.setattr("app.services.course_import_service.get_course_provider", lambda: provider)

    response = client.get("/api/v1/courses/search?q=Pine")
    assert response.status_code == 502
    assert response.json()["code"] == "external_service_error"


def test_provider_timeout_returns_clean_error(client: TestClient, monkeypatch) -> None:
    class TimeoutProvider(StubCourseProvider):
        def search_courses(self, query: str) -> list[NormalizedCourseSummary]:
            raise GolfCourseApiClientError("GolfCourseAPI request timed out.")

    monkeypatch.setattr(
        "app.services.course_import_service.get_course_provider",
        lambda: TimeoutProvider(),
    )

    response = client.get("/api/v1/courses/search?q=Pine")
    assert response.status_code == 502
    assert response.json()["code"] == "external_service_error"
    assert "timed out" in response.json()["message"].lower()


def test_import_persists_snapshot_fields(client: TestClient, monkeypatch) -> None:
    provider = StubCourseProvider()
    monkeypatch.setattr("app.services.course_import_service.get_course_provider", lambda: provider)

    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]
    client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )

    imported = client.post(
        f"/api/v1/rounds/{round_id}/course/import",
        json={"external_id": "991"},
    )
    assert imported.status_code == 200
    course_id = imported.json()["course_id"]

    course_detail = client.get(f"/api/v1/courses/{course_id}")
    assert course_detail.status_code == 200
    assert course_detail.json()["external_course_id"] == "991"
    assert course_detail.json()["source"] == "golfcourseapi"
    assert len(course_detail.json()["holes"]) == 2


def test_import_deduplicates_same_external_course(client: TestClient, monkeypatch) -> None:
    provider = StubCourseProvider()
    monkeypatch.setattr("app.services.course_import_service.get_course_provider", lambda: provider)

    round_one = client.post("/api/v1/rounds", json={}).json()["id"]
    client.post(
        f"/api/v1/rounds/{round_one}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )
    first_import = client.post(
        f"/api/v1/rounds/{round_one}/course/import",
        json={"external_id": "991"},
    )
    assert first_import.status_code == 200
    first_course_id = first_import.json()["course_id"]

    round_two = client.post("/api/v1/rounds", json={}).json()["id"]
    client.post(
        f"/api/v1/rounds/{round_two}/players",
        json={"display_name": "Bob", "sort_order": 1},
    )
    second_import = client.post(
        f"/api/v1/rounds/{round_two}/course/import",
        json={"external_id": "991"},
    )
    assert second_import.status_code == 200
    assert second_import.json()["course_id"] == first_course_id


def test_hydrated_course_detail_does_not_refetch_when_holes_exist(
    client: TestClient, monkeypatch
) -> None:
    provider = StubCourseProvider()
    monkeypatch.setattr("app.services.course_import_service.get_course_provider", lambda: provider)

    round_id = client.post("/api/v1/rounds", json={}).json()["id"]
    client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )
    imported = client.post(
        f"/api/v1/rounds/{round_id}/course/import",
        json={"external_id": "991"},
    )
    assert imported.status_code == 200
    course_id = imported.json()["course_id"]

    before = provider.detail_calls
    first_detail = client.get(f"/api/v1/courses/{course_id}")
    second_detail = client.get(f"/api/v1/courses/{course_id}")

    assert first_detail.status_code == 200
    assert second_detail.status_code == 200
    # Detail calls came from import only; local hydrated snapshot should serve both reads.
    assert provider.detail_calls == before


def test_imported_hole_snapshot_has_sequential_numbers_and_expected_pars(
    client: TestClient, monkeypatch
) -> None:
    class SnapshotProvider(StubCourseProvider):
        def get_course_detail(self, external_id: str) -> NormalizedCourseDetail:
            self.detail_calls += 1
            return NormalizedCourseDetail(
                external_id=external_id,
                name="Snapshot Course",
                city="Dublin",
                state="OH",
                country="USA",
                total_holes=3,
                source="golfcourseapi",
                holes=[
                    NormalizedCourseHole(
                        hole_number=1,
                        par=4,
                        yardage=410,
                        handicap=8,
                        tee_name="Blue",
                    ),
                    NormalizedCourseHole(
                        hole_number=2,
                        par=3,
                        yardage=175,
                        handicap=16,
                        tee_name="Blue",
                    ),
                    NormalizedCourseHole(
                        hole_number=3,
                        par=5,
                        yardage=525,
                        handicap=2,
                        tee_name="Blue",
                    ),
                ],
            )

    provider = SnapshotProvider()
    monkeypatch.setattr("app.services.course_import_service.get_course_provider", lambda: provider)

    round_id = client.post("/api/v1/rounds", json={}).json()["id"]
    client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )
    imported = client.post(
        f"/api/v1/rounds/{round_id}/course/import",
        json={"external_id": "101"},
    )
    assert imported.status_code == 200

    course_id = imported.json()["course_id"]
    detail = client.get(f"/api/v1/courses/{course_id}")
    assert detail.status_code == 200

    holes = detail.json()["holes"]
    assert [hole["hole_number"] for hole in holes] == [1, 2, 3]
    assert [hole["par"] for hole in holes] == [4, 3, 5]


def test_import_handles_duplicate_tee_names_without_500(
    client: TestClient, monkeypatch
) -> None:
    class DuplicateTeeProvider(StubCourseProvider):
        def get_course_detail(self, external_id: str) -> NormalizedCourseDetail:
            self.detail_calls += 1
            return NormalizedCourseDetail(
                external_id=external_id,
                name="Duplicate Tee Course",
                city="San Ramon",
                state="CA",
                country="USA",
                total_holes=2,
                source="golfcourseapi",
                holes=[
                    NormalizedCourseHole(
                        hole_number=1,
                        par=4,
                        yardage=400,
                        handicap=8,
                        tee_name="Blue",
                    ),
                    NormalizedCourseHole(
                        hole_number=2,
                        par=3,
                        yardage=180,
                        handicap=16,
                        tee_name="Blue",
                    ),
                ],
            )

    provider = DuplicateTeeProvider()
    monkeypatch.setattr("app.services.course_import_service.get_course_provider", lambda: provider)

    round_id = client.post("/api/v1/rounds", json={}).json()["id"]
    client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )
    imported = client.post(
        f"/api/v1/rounds/{round_id}/course/import",
        json={"external_id": "19695"},
    )
    assert imported.status_code == 200
