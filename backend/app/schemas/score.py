from pydantic import BaseModel


class ScoreCreate(BaseModel):
    player_id: int
    strokes: int


class ScoreRead(BaseModel):
    id: int
    round_id: int
    player_id: int
    hole: int
    strokes: int

    class Config:
        from_attributes = True
