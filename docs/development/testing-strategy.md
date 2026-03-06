# Testing Strategy

## Testing pyramid

### Backend

- unit tests for services and validation rules
- integration tests for API routes and DB interactions
- migration smoke tests when practical

### Frontend

- unit tests for utility logic
- component tests for key interactions
- route-level tests for major flows

## Minimum coverage areas

### Backend critical rules

- max 4 players per round
- duplicate contribution prevention for same player/hole/shot
- lock enforcement after completion
- leaderboard calculation
- round summary generation
- hole score upsert behavior

### Frontend critical flows

- create round
- add players
- select course
- update hole score
- add and remove contributions
- complete round
- summary view

## Manual verification expectations

Every milestone should update the verification checklist with:

- positive path
- empty state
- validation failure
- lock behavior
- persistence across refresh

## Recommended commands

### API

- `pytest`
- `ruff check .`
- `black --check .`

### Web

- `npm run lint`
- `npm run test`
- `npm run build`
