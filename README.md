# Scrambling Monorepo

This repository contains the MVP foundation for the Scrambling app as a monorepo.

## Scope in this phase

- `apps/web`: React + TypeScript web shell (strict TypeScript)
- `apps/api`: FastAPI scaffold
- `packages/shared-types`: shared TypeScript domain and API types
- `packages/api-client`: typed API client for the web app

Legacy proof-of-concept code is intentionally retained as reference only:

- `golf-scorecard-app/`
- `backend/`

## Repository layout

```text
apps/
  api/
  web/
packages/
  api-client/
  shared-types/
docs/
  product/
  architecture/
  development/
```

## Prerequisites

- Node.js 20+
- npm 7+ (npm 10+ recommended)
- Python 3.12+

## Install

```bash
npm run install:all
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r apps/api/requirements.txt
```

## Run

### Web

```bash
npm run dev:web
```

### API

```bash
alembic -c apps/api/alembic.ini upgrade head
uvicorn app.main:app --reload --app-dir apps/api
```

## Lint, format, and tests

```bash
npm run lint
npm run format:check
npm run test
npm run typecheck

python -m ruff check apps/api
python -m ruff format --check apps/api
alembic -c apps/api/alembic.ini upgrade head
python -m pytest apps/api/tests
```

## CI

A CI skeleton is available at `.github/workflows/ci.yml` and runs web + API checks on pushes and pull requests.

## Release prep

Use the MVP release checklist before cutting a release:

- `docs/development/release-checklist.md`

## What is next

- `docs/plan/next-priorities-roadmap.md`: implementation sequence for UI iteration, auth/login, and player invites
- `docs/plan/milestone-plan.md`: extended milestones for post-MVP evolution
