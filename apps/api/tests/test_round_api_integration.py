from fastapi.testclient import TestClient

from app.integrations.course_provider import (
    NormalizedCourseDetail,
    NormalizedCourseHole,
    NormalizedCourseSummary,
)


class StubCourseProvider:
    def __init__(self) -> None:
        self.raise_error = False

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


def test_course_search_detail_assign_and_round_aggregate(client: TestClient, monkeypatch) -> None:
    provider = StubCourseProvider()
    monkeypatch.setattr("app.services.round_service.get_course_provider", lambda: provider)

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
    monkeypatch.setattr("app.services.round_service.get_course_provider", lambda: provider)

    response = client.get("/api/v1/courses/search?q=Pine")
    assert response.status_code == 502
    assert response.json()["code"] == "external_service_error"


def test_import_persists_snapshot_fields(client: TestClient, monkeypatch) -> None:
    provider = StubCourseProvider()
    monkeypatch.setattr("app.services.round_service.get_course_provider", lambda: provider)

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
