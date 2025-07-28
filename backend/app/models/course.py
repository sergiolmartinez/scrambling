from sqlalchemy import Column, Integer, String
from app.db import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    lat = Column(String)  # for map preview
    lng = Column(String)
