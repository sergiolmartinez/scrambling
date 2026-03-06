# Prompt 02 - API Domain and Persistence

You are implementing the Scrambling app in this repository.

Follow these files as the source of truth:

- docs/product/mvp-scope.md
- docs/architecture/target-architecture.md
- docs/architecture/domain-model.md
- docs/architecture/api-contract.md
- docs/development/codex-master-prompt.md

Constraints:

- Stay strictly within MVP scope
- Keep frontend and backend decoupled
- Prefer clean, composable modules
- Use strict typing
- Add or update tests for business logic
- Update docs affected by your changes
- Do not leave placeholder TODOs
- Do not refactor unrelated files
- Preserve any legacy POC code unless explicitly told to move it

After completing the task, provide:

1. Files changed
2. Commands to install dependencies
3. Commands to run the app
4. Commands to run tests
5. Manual verification steps
6. Known risks or follow-up items

Implement the API domain model for the Scrambling MVP.

## Requirements

Use:

- FastAPI
- SQLAlchemy 2.x
- Alembic
- PostgreSQL
- Pydantic v2
- pytest

Implement these entities:

- Course
- CourseHole
- Round
- RoundPlayer
- HoleScore
- ShotContribution

## Rules

- a round can have 1 to 4 players
- a completed round is locked
- contributions are unique per round, hole, shot, and player
- hole score should support upsert behavior

## Also do

- create migrations
- create factories or fixtures for tests
- add unit tests for core service rules
- update relevant docs

## Output format

Include:

- schema summary
- migration commands
- test commands
- files changed
