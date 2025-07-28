from pydantic import BaseModel


class PlayerCreate(BaseModel):
    name: str


class PlayerRead(BaseModel):
    id: int
    name: str
    round_id: int

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2
