from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.player import Player
from app.schemas.player import PlayerCreate


def add_player_to_round(db: Session, round_id: int, player: PlayerCreate):
    from app.models.round import Round
    rnd = db.query(Round).filter(Round.id == round_id).first()
    if not rnd or rnd.completed:
        raise HTTPException(
            status_code=403, detail="Round is complete. No further edits allowed.")

    new_player = Player(name=player.name, round_id=round_id)
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player
