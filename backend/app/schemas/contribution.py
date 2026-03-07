from pydantic import BaseModel
from typing import List


class ContributionCreate(BaseModel):
    hole: int
    shot: int
    player_ids: List[int]


class ContributionRead(BaseModel):
    id: int
    round_id: int
    hole: int
    shot: int
    player_id: int

    class Config:
        from_attributes = True
