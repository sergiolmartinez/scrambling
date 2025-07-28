from sqlalchemy.orm import Session
from app.models.score import Score
from app.schemas.score import ScoreCreate


def submit_score(db: Session, round_id: int, hole: int, score_data: ScoreCreate):
    score = (
        db.query(Score)
        .filter_by(round_id=round_id, hole=hole, player_id=score_data.player_id)
        .first()
    )
    if score:
        score.strokes = score_data.strokes  # update existing
    else:
        score = Score(
            round_id=round_id,
            player_id=score_data.player_id,
            hole=hole,
            strokes=score_data.strokes,
        )
        db.add(score)
    db.commit()
    db.refresh(score)
    return score


def get_scores_for_hole(db: Session, round_id: int, hole: int):
    return (
        db.query(Score)
        .filter_by(round_id=round_id, hole=hole)
        .all()
    )
