from sqlalchemy.orm import Session
from app.models.round import Round
from datetime import datetime


def create_round(db: Session):
    new_round = Round()
    db.add(new_round)
    db.commit()
    db.refresh(new_round)
    return new_round


def complete_round(db: Session, round_id: int):
    rnd = db.query(Round).filter(Round.id == round_id).first()
    if not rnd:
        return None
    if rnd.completed:
        return rnd
    rnd.completed = True
    rnd.ended_at = datetime.utcnow()
    db.commit()
    db.refresh(rnd)
    return rnd


def get_round_summary(db: Session, round_id: int):
    from app.models.round import Round, Player, Course, Contribution
    from sqlalchemy import func

    rnd = db.query(Round).filter(Round.id == round_id).first()
    if not rnd:
        return None

    course = db.query(Course).filter(Course.id == rnd.course_id).first()
    players = db.query(Player).filter(Player.round_id == round_id).all()

    # Get contribution counts per player
    contribution_counts = (
        db.query(Contribution.player_id, func.count().label("count"))
        .filter(Contribution.round_id == round_id)
        .group_by(Contribution.player_id)
        .all()
    )
    contribution_map = {c.player_id: c.count for c in contribution_counts}

    return {
        "round_id": round_id,
        "started_at": rnd.started_at,
        "ended_at": rnd.ended_at,
        "completed": rnd.completed,
        "course": {
            "id": course.id,
            "name": course.name,
            "location": course.location
        } if course else None,
        "players": [
            {
                "id": p.id,
                "name": p.name,
                "contributions": contribution_map.get(p.id, 0)
            }
            for p in players
        ]
    }
