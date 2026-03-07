# Scrambling API

This is the backend API for the Scrambling golf scorekeeping app. It powers round creation, player contributions, leaderboard logic, and round summaries.

## 🚀 Stack

- FastAPI
- SQLite (via SQLAlchemy)
- Pydantic v2
- Uvicorn

## 🔧 Setup

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📚 API Overview

POST /rounds/ – Create a new round

POST /rounds/{id}/players – Add players to a round

POST /courses/ + assign – Add & assign golf course

POST /rounds/{id}/holes/contribute – Record contributions per shot

GET /rounds/{id}/leaderboard – Get leaderboard by contribution tally

POST /rounds/{id}/complete – Finalize round

GET /rounds/{id}/summary – Get round summary with players and contributions

## 🧪 Testing

```bash
TODO: Add Pytest + FastAPI test suite
```
