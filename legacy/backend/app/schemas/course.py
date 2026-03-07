from pydantic import BaseModel
from typing import Optional


class CourseBase(BaseModel):
    name: str
    location: Optional[str] = None
    lat: Optional[str] = None
    lng: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseRead(CourseBase):
    id: int

    class Config:
        from_attributes = True
