from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.schemas.player import PlayerCreate, PlayerRead
from app.crud import player as player_crud

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/rounds/{round_id}/players", response_model=PlayerRead)
def add_player(round_id: int, player: PlayerCreate, db: Session = Depends(get_db)):
    return player_crud.add_player_to_round(db, round_id, player)
