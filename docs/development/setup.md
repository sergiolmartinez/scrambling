# Setup Plan

## Suggested developer prerequisites

### API

- Python 3.12+

### Web

- Node 20+
- npm 10+

## Suggested environment files

### API `.env` (repo root `.env` recommended)

```env
APP_ENV=development
API_V1_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/scrambling
CORS_ORIGINS=http://localhost:5173
GOLFCOURSEAPI_BASE_URL=https://api.golfcourseapi.com
GOLFCOURSEAPI_API_KEY=<set-local-only>
GOLFCOURSEAPI_TIMEOUT_SECONDS=10
GOLFCOURSEAPI_CACHE_TTL_SECONDS=300
```

Note: API settings load `.env` from the current working directory. Running commands from repo root should use root `.env`.

### `apps/web/.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

The web API client automatically appends `/api/v1` when it is not included.

## Suggested first-run commands

### Install dependencies

```bash
npm run install:all
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r apps/api/requirements.txt
```

### Start API

```bash
alembic -c apps/api/alembic.ini upgrade head
uvicorn app.main:app --reload --app-dir apps/api
```

### Start web

```bash
npm run dev:web
```

Web shell routes are available at:

- `http://localhost:5173/setup`
- `http://localhost:5173/scoring`
- `http://localhost:5173/leaderboard`
- `http://localhost:5173/summary`
