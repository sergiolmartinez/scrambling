# MVP Release Checklist

## Scope guard

- confirm no auth, social, achievements, mobile, or websocket features were added
- confirm routes and data model remain within `docs/product/mvp-scope.md`

## Environment readiness

- PostgreSQL database exists and `DATABASE_URL` points to it
- `apps/api/.env` contains `API_V1_PREFIX` and `CORS_ORIGINS`
- `apps/web/.env` `VITE_API_BASE_URL` points at API host (with or without `/api/v1`)

## Database and API

- run `alembic -c apps/api/alembic.ini upgrade head`
- run `python -m ruff check apps/api`
- run `python -m ruff format --check apps/api`
- run `python -m pytest apps/api/tests`
- verify completed rounds reject all mutating setup/scoring endpoints

## Web

- run `npm run install:all`
- run `npm run lint --prefix apps/web`
- run `npm run typecheck --prefix apps/web`
- run `npm run test --prefix apps/web`
- run `npm run build --prefix apps/web`

## End-to-end MVP verification

- create round
- assign course
- add players (1 to 4)
- enter hole scores and shot contributions
- verify leaderboard ordering and totals
- complete round and confirm locked behavior
- verify summary shows course, players, hole results, and totals
- refresh browser and confirm server-backed state is still shown

## Release artifacts

- update `README.md` and `docs/development/*` if commands or behavior changed
- include test command outputs in PR summary
- capture known limitations under backlog/follow-up
