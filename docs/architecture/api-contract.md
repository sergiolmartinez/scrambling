# API Contract

## Base path

`/api/v1`

## Endpoints for MVP

## Implemented in Prompt 02 (Domain + Persistence)

- `GET /health`
- `POST /courses`
- `GET /courses/search`
- `GET /courses/external/{external_id}`
- `GET /courses/{course_id}`
- `POST /rounds`
- `GET /rounds/{round_id}`
- `POST /rounds/{round_id}/players`
- `PATCH /rounds/{round_id}/players/{player_id}`
- `DELETE /rounds/{round_id}/players/{player_id}`
- `POST /rounds/{round_id}/course`
- `POST /rounds/{round_id}/course/import`
- `PUT /rounds/{round_id}/holes/{hole_number}`
- `POST /rounds/{round_id}/holes/{hole_number}/shots`
- `GET /rounds/{round_id}/holes/{hole_number}/shots`
- `DELETE /rounds/{round_id}/holes/{hole_number}/shots/{shot_number}/players/{player_id}`
- `GET /rounds/{round_id}/leaderboard`
- `POST /rounds/{round_id}/complete`
- `GET /rounds/{round_id}/summary`

### Round lifecycle

#### `POST /rounds`
Create a round.

Response:
- round id
- status
- timestamps

#### `GET /rounds/{round_id}`
Return the current round aggregate.

Should include:
- round
- course summary if assigned
- players
- hole scores
- contribution snapshot

#### `POST /rounds/{round_id}/complete`
Mark a round as completed and lock editing.

#### `GET /rounds/{round_id}/summary`
Return a completion-oriented summary payload.

### Players

#### `POST /rounds/{round_id}/players`
Add a player.

#### `PATCH /rounds/{round_id}/players/{player_id}`
Edit a player's display name or sort order.

#### `DELETE /rounds/{round_id}/players/{player_id}`
Remove a player if the round is not completed.

### Courses

#### `GET /courses/search`
Search courses by text query via backend-managed provider integration.

Query params:
- `q`
- optional location parameters later
- `q` must be at least 2 non-whitespace characters

Response is a normalized lightweight external course list with `external_id`.

#### `GET /courses/external/{external_id}`
Get normalized external course detail with hole data.

#### `GET /courses/{course_id}`
Get course detail with holes.

#### `POST /rounds/{round_id}/course`
Assign a course to a round.

Body:
- `course_id`

#### `POST /rounds/{round_id}/course/import`
Import external course snapshot and assign to round.

Body:
- `external_id`

### Hole scoring

#### `PUT /rounds/{round_id}/holes/{hole_number}`
Create or update hole score.

Body:
- `score`
- optional `par_snapshot`
- optional `completed`

### Contributions

#### `POST /rounds/{round_id}/holes/{hole_number}/shots`
Add one or more player contributions for a shot.

Body:
- `shot_number`
- `player_ids` or `round_player_ids`
- optional `shot_type`

#### `GET /rounds/{round_id}/holes/{hole_number}/shots`
Return shot contributions for one hole.

#### `DELETE /rounds/{round_id}/holes/{hole_number}/shots/{shot_number}/players/{player_id}`
Remove one contribution record.

### Leaderboard

#### `GET /rounds/{round_id}/leaderboard`
Return ordered player totals.

## Error rules

Use a consistent error shape with:

- `code`
- `message`
- `details` optional

Use status codes consistently:

- `400` validation errors
- `404` not found
- `409` invariant conflicts such as duplicate contributions
- `422` schema validation if using FastAPI defaults
- `423` or `409` for locked round semantics; choose one and apply consistently

## Contract guidelines

- never return DB internals directly
- prefer stable DTOs
- document lock behavior on all mutating routes
- document maximum players and duplicate-contribution constraints
