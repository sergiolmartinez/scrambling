from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.contribution import Contribution
from app.schemas.contribution import ContributionCreate


def add_contributions(db: Session, round_id: int, data: ContributionCreate):
    from app.models.round import Round
    rnd = db.query(Round).filter(Round.id == round_id).first()
    if not rnd or rnd.completed:
        raise HTTPException(
            status_code=403, detail="Round is complete. No further edits allowed.")

    contributions = []
    for player_id in data.player_ids:
        contrib = Contribution(
            round_id=round_id,
            hole=data.hole,
            shot=data.shot,
            player_id=player_id
        )
        db.add(contrib)
        contributions.append(contrib)
    db.commit()
    for c in contributions:
        db.refresh(c)
    return contributions


def get_contributions_for_hole(db: Session, round_id: int, hole: int):
    return (
        db.query(Contribution)
        .filter_by(round_id=round_id, hole=hole)
        .all()
    )


def get_contribution_tally(db: Session, round_id: int):
    from sqlalchemy import func
    return (
        db.query(Contribution.player_id, func.count().label("contributions"))
        .filter_by(round_id=round_id)
        .group_by(Contribution.player_id)
        .all()
    )


def delete_contribution(db: Session, round_id: int, hole: int, shot: int, player_id: int):
    contrib = (
        db.query(Contribution)
        .filter_by(round_id=round_id, hole=hole, shot=shot, player_id=player_id)
        .first()
    )
    if contrib:
        db.delete(contrib)
        db.commit()
        return True
    return False
