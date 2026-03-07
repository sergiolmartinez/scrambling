# Domain Model

## Core entities

### Course

Represents a playable golf course used by a round.

Suggested fields:

- id
- external_course_id nullable
- name
- city nullable
- state nullable
- country nullable
- total_holes
- source
- created_at
- updated_at

### CourseHole

Represents the course definition for a specific hole.

Suggested fields:

- id
- course_id
- hole_number
- par
- yardage nullable
- handicap nullable
- tee_name nullable

Constraints:

- unique `(course_id, hole_number, tee_name)` or simplify to one default tee set for MVP

### Round

Represents a single scramble round.

Suggested fields:

- id
- status (`draft`, `active`, `completed`)
- course_id nullable until assigned
- started_at nullable
- completed_at nullable
- notes nullable
- created_at
- updated_at

### RoundPlayer

Represents a player participating in a round.

Suggested fields:

- id
- round_id
- display_name
- sort_order
- created_at

Constraints:

- unique `(round_id, sort_order)`
- maximum 4 players enforced in service layer

### HoleScore

Represents the round result for one hole.

Suggested fields:

- id
- round_id
- hole_number
- score nullable
- par_snapshot nullable
- completed boolean
- created_at
- updated_at

Constraints:

- unique `(round_id, hole_number)`

### ShotContribution

Represents one player's contribution to one shot on one hole.

Suggested fields:

- id
- round_id
- hole_number
- shot_number
- round_player_id
- shot_type nullable
- created_at

Constraints:

- unique `(round_id, hole_number, shot_number, round_player_id)`

## Key invariants

1. A completed round cannot be edited.
2. A round must have at least one player before scoring starts.
3. A hole score is unique per round and hole.
4. The same player cannot be recorded twice on the same hole and shot.
5. Contribution tallies are derived from `ShotContribution`, not stored redundantly.

## Derived views

### Leaderboard

For each round player:

- total contributions
- optional breakdown by shot type
- optional percentage of all recorded contributions

### Round summary

- course metadata snapshot
- player list
- hole-by-hole results
- contribution totals
- start/end timestamps
- round duration if both timestamps exist

## Recommended state transitions

- `draft` -> `active` when meaningful scoring begins or when explicitly started
- `draft|active` -> `completed` when round is completed
- no transitions allowed out of `completed`
