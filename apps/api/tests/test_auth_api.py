from fastapi.testclient import TestClient


def test_sign_up_sets_cookie_and_returns_user(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "sergio@example.com",
            "display_name": "Sergio",
            "password": "supersecure123",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "sergio@example.com"
    assert body["display_name"] == "Sergio"
    assert "set-cookie" in response.headers
    assert "scrambling_session=" in response.headers["set-cookie"]


def test_sign_up_rejects_duplicate_email(client: TestClient) -> None:
    payload = {
        "email": "sergio@example.com",
        "display_name": "Sergio",
        "password": "supersecure123",
    }
    first = client.post("/api/v1/auth/sign-up", json=payload)
    second = client.post("/api/v1/auth/sign-up", json=payload)

    assert first.status_code == 201
    assert second.status_code == 409
    assert second.json()["code"] == "conflict"


def test_sign_in_and_get_me_and_sign_out(client: TestClient) -> None:
    client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "sergio@example.com",
            "display_name": "Sergio",
            "password": "supersecure123",
        },
    )

    client.cookies.clear()
    sign_in = client.post(
        "/api/v1/auth/sign-in",
        json={"email": "sergio@example.com", "password": "supersecure123"},
    )
    assert sign_in.status_code == 200
    assert "scrambling_session=" in sign_in.headers.get("set-cookie", "")

    me = client.get("/api/v1/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == "sergio@example.com"

    sign_out = client.post("/api/v1/auth/sign-out")
    assert sign_out.status_code == 204
    assert "Max-Age=0" in sign_out.headers.get("set-cookie", "")

    me_after_sign_out = client.get("/api/v1/auth/me")
    assert me_after_sign_out.status_code == 401
    assert me_after_sign_out.json()["code"] == "unauthorized"


def test_sign_in_with_invalid_credentials_returns_401(client: TestClient) -> None:
    client.post(
        "/api/v1/auth/sign-up",
        json={
            "email": "sergio@example.com",
            "display_name": "Sergio",
            "password": "supersecure123",
        },
    )

    response = client.post(
        "/api/v1/auth/sign-in",
        json={"email": "sergio@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["code"] == "unauthorized"


def test_me_requires_auth_cookie(client: TestClient) -> None:
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["code"] == "unauthorized"
