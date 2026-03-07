# GolfCourseAPI Integration

## Purpose

Provide external golf course search/detail data through the backend only, then snapshot imported courses into local DB for round stability.

Frontend never calls GolfCourseAPI directly.

## External calls

Base URL:

- `GOLFCOURSEAPI_BASE_URL` (default `https://api.golfcourseapi.com`)

Auth header format:

- `Authorization: Key <API_KEY>`

Endpoints used:

- `GET /v1/search?search_query={q}`
- `GET /v1/courses/{id}`

## Internal normalized endpoints

- `GET /api/v1/courses/search?q=...`
- `GET /api/v1/courses/external/{external_id}`
- `POST /api/v1/rounds/{round_id}/course/import` with `{ "external_id": "..." }`

## Integration boundary

- `app/integrations/golfcourseapi/client.py`: provider HTTP client and auth header handling.
- `app/integrations/golfcourseapi/schemas.py`: external payload models.
- `app/integrations/golfcourseapi/mapper.py`: normalization (provider -> internal DTOs).
- `app/services/course_import_service.py`: orchestration for search, detail, snapshot import, dedupe, and lazy hydration.
- `app/services/round_service.py`: round lifecycle/scoring only; delegates course provider concerns.

## What we store

On import, backend snapshots course data into local tables:

- `courses`
  - `external_course_id`
  - `source` (`golfcourseapi`)
  - `imported_at`
  - `external_payload_hash`
  - normalized name/location/total_holes
- `course_holes`
  - hole-by-hole snapshot from provider tee sets

Rounds then reference local `courses.id`, so scoring is stable even if upstream provider data changes.

Hole mapping rule:

- provider holes do not contain explicit `hole_number`.
- backend derives `hole_number = index + 1` per tee set to create deterministic contiguous numbering.

## Failure modes and handling

- timeout/network/provider HTTP failures -> `502 external_service_error`
- malformed provider payload -> `502 external_service_error`
- short search query -> `400 validation_error`
- locked round import attempt -> `423 round_locked`

## Lazy hydration behavior

- `GET /api/v1/courses/{course_id}` always prefers local snapshot.
- if `course.source == "golfcourseapi"` and no local `course_holes` exist yet, backend fetches provider detail once, snapshots holes locally, sets `imported_at`, and returns the hydrated local course.
- once holes exist, subsequent reads do not call provider.

## Key rotation

1. Update `GOLFCOURSEAPI_API_KEY` in local/hosted secret store.
2. Restart API process so new env var is loaded.
3. Verify by calling `GET /api/v1/courses/search?q=...`.

Never commit real API keys. Commit only `.env.example`.
