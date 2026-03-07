from fastapi import FastAPI
from app.api import rounds, players, courses, scores
from app.db import init_db

app = FastAPI(title="Scrambling API")

app.include_router(rounds.router, prefix="/rounds")
app.include_router(players.router, prefix="/players")
app.include_router(courses.router, prefix="/courses")
app.include_router(scores.router, prefix="/scores")


@app.on_event("startup")
def on_startup():
    init_db()
