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
- integration suite verifies completed rounds reject mutating setup and scoring endpoints with locked status
- integration suite includes edge cases for short course search queries, missing contribution deletes, and completion without players

### Frontend checks

- `npm run lint --prefix apps/web`
- `npm run test --prefix apps/web`
- `npm run build --prefix apps/web`
- `npm run typecheck --prefix apps/web`
- route shell tests cover setup navigation and round creation shell behavior
- setup flow tests cover max-player UI enforcement and scoring handoff readiness
- scoring route tests cover hole navigation, hole-score upsert, multi-player contribution submission, and single contribution deletion
- leaderboard and summary route tests cover ordered totals and summary data rendering
- setup route tests cover completed-round locked UX state

## Manual verification expectations

Every milestone should update the verification checklist with:

- positive path
- empty state
- validation failure
- persistence across refresh

## Release gate

Before a release, run the checklist in `docs/development/release-checklist.md` end-to-end.
