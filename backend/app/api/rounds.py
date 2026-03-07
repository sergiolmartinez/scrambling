from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.crud import round as round_crud
from app.schemas import round as round_schema

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=round_schema.RoundRead)
def create_round(db: Session = Depends(get_db)):
    return round_crud.create_round(db)


@router.post("/rounds/{round_id}/complete", response_model=round_schema.RoundRead)
def complete_round(round_id: int, db: Session = Depends(get_db)):
    round = round_crud.complete_round(db, round_id)
    if not round:
        raise HTTPException(status_code=404, detail="Round not found")
    return round


@router.get("/rounds/{round_id}/leaderboard")
def get_leaderboard(round_id: int, db: Session = Depends(get_db)):
    tally = contribution_crud.get_contribution_tally(db, round_id)
    return [{"player_id": row.player_id, "contributions": row.contributions} for row in tally]


@router.get("/rounds/{round_id}/summary")
def get_round_summary(round_id: int, db: Session = Depends(get_db)):
    summary = round_crud.get_round_summary(db, round_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Round not found")
    return summary
