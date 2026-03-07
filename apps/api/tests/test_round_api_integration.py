from fastapi.testclient import TestClient


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


def test_course_search_detail_assign_and_round_aggregate(client: TestClient) -> None:
    created_course = client.post(
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
    assert created_course.status_code == 201
    course_id = created_course.json()["id"]

    search = client.get("/api/v1/courses/search?q=Pebble")
    assert search.status_code == 200
    assert any(item["id"] == course_id for item in search.json())

    detail = client.get(f"/api/v1/courses/{course_id}")
    assert detail.status_code == 200
    assert detail.json()["name"] == "Pebble Beach Golf Links"

    created_round = client.post("/api/v1/rounds", json={})
    round_id = created_round.json()["id"]
    client.post(
        f"/api/v1/rounds/{round_id}/players",
        json={"display_name": "Alice", "sort_order": 1},
    )

    assigned = client.post(f"/api/v1/rounds/{round_id}/course", json={"course_id": course_id})
    assert assigned.status_code == 200
    assert assigned.json()["course_id"] == course_id

    aggregate = client.get(f"/api/v1/rounds/{round_id}")
    assert aggregate.status_code == 200
    payload = aggregate.json()
    assert payload["course"]["id"] == course_id
    assert len(payload["players"]) == 1


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
