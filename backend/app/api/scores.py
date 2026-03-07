from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.schemas.contribution import ContributionCreate, ContributionRead
from app.crud import contribution as contribution_crud

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/rounds/{round_id}/holes/contribute", response_model=list[ContributionRead])
def add_contributions(round_id: int, data: ContributionCreate, db: Session = Depends(get_db)):
    return contribution_crud.add_contributions(db, round_id, data)


@router.get("/rounds/{round_id}/holes/{hole}/contributions", response_model=list[ContributionRead])
def get_contributions(round_id: int, hole: int, db: Session = Depends(get_db)):
    return contribution_crud.get_contributions_for_hole(db, round_id, hole)


@router.delete("/rounds/{round_id}/holes/{hole}/shots/{shot}/players/{player_id}")
def delete_contribution(round_id: int, hole: int, shot: int, player_id: int, db: Session = Depends(get_db)):
    success = contribution_crud.delete_contribution(
        db, round_id, hole, shot, player_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contribution not found")
    return {"detail": "Contribution removed"}
