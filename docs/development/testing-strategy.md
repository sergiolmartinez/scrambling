# Testing Strategy

## Testing pyramid

### Backend

- unit tests for services and validation rules
- integration tests for API routes and DB interactions

### Frontend

- unit tests for utility logic
- component tests for key interactions

## Foundation baseline in this phase

### Backend checks

- `python -m ruff check apps/api`
- `python -m ruff format --check apps/api`
- `alembic -c apps/api/alembic.ini upgrade head`
- `python -m pytest apps/api/tests`
- integration suite includes round lifecycle, contributions, leaderboard, and summary endpoint flows

### Frontend checks

- `npm run lint --prefix apps/web`
- `npm run test --prefix apps/web`
- `npm run build --prefix apps/web`
- `npm run typecheck --prefix apps/web`

## Manual verification expectations

Every milestone should update the verification checklist with:

- positive path
- empty state
- validation failure
- persistence across refresh
