from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RoundCreate(BaseModel):
    pass  # No input needed yet


class RoundRead(BaseModel):
    id: int
    started_at: datetime
    ended_at: Optional[datetime]
    completed: bool

    class Config:
        orm_mode = True
