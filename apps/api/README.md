# API App (`apps/api`)

FastAPI + SQLAlchemy + Alembic API for Scrambling MVP.

## Commands

```bash
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r apps/api/requirements.txt

alembic -c apps/api/alembic.ini upgrade head
uvicorn app.main:app --reload --app-dir apps/api

python -m ruff check apps/api
python -m ruff format --check apps/api
python -m pytest apps/api/tests
```

## Environment

Create `apps/api/.env` from `.env.example`.
