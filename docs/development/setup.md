# Setup Plan

## Suggested developer prerequisites

### API

- Python 3.12+

### Web

- Node 20+
- npm 10+

## Suggested environment files

### `apps/api/.env`

```env
APP_ENV=development
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:5173
```

### `apps/web/.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Suggested first-run commands

### Install dependencies

```bash
npm install
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r apps/api/requirements.txt
```

### Start API

```bash
uvicorn app.main:app --reload --app-dir apps/api
```

### Start web

```bash
npm run dev:web
```
