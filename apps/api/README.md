# API App (`apps/api`)

FastAPI + SQLAlchemy + Alembic API for Scrambling MVP.

## Environment

Create `.env` in repo root or `apps/api/.env` using:

- `apps/api/.env.example`

Required integration vars:

- `GOLFCOURSEAPI_BASE_URL`
- `GOLFCOURSEAPI_API_KEY`
- `GOLFCOURSEAPI_TIMEOUT_SECONDS`
- `GOLFCOURSEAPI_CACHE_TTL_SECONDS`

## Commands

```bash
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r apps/api/requirements.txt

alembic -c apps/api/alembic.ini upgrade head
uvicorn app.main:app --reload --app-dir apps/api

python -m ruff check apps/api
python -m ruff format --check apps/api
python -m pytest apps/api/tests
```

## Local course snapshot behavior

- `POST /api/v1/rounds/{round_id}/course/import` fetches provider detail and stores a local snapshot in `courses` + `course_holes`.
- `GET /api/v1/courses/{course_id}` serves local data.
- For `source=golfcourseapi`, if a course row exists without holes, the first `GET` lazily hydrates holes once and persists `imported_at`.

## Course integration endpoints

- `GET /api/v1/courses/search?q=...` (provider-backed normalized search)
- `GET /api/v1/courses/external/{external_id}` (provider-backed normalized detail)
- `POST /api/v1/rounds/{round_id}/course/import` with `{ "external_id": "..." }`

Manual course flow remains available:

- `POST /api/v1/courses`
- `POST /api/v1/rounds/{round_id}/course`
