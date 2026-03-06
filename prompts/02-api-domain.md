# Prompt 02 - API Domain and Persistence

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
