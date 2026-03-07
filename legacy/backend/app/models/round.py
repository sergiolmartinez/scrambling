from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime


class Round(Base):
    __tablename__ = "rounds"
    id = Column(Integer, primary_key=True, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    completed = Column(Boolean, default=False)
    players = relationship("Player", back_populates="round",
                           cascade="all, delete-orphan")
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    course = relationship("Course")
