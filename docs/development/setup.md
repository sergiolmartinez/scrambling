# Setup Plan

## Suggested developer prerequisites

### API

- Python 3.12+
- PostgreSQL 15+

### Web

- Node 20+
- npm 10+

## Suggested environment files

### `apps/api/.env`

```env
APP_ENV=development
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/scrambling
CORS_ORIGINS=http://localhost:5173
```

### `apps/web/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Suggested first-run commands

### API

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Web

```bash
cd apps/web
npm install
npm run dev
```
