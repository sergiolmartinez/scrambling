from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Course(Base, TimestampMixin):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_course_id: Mapped[str] = mapped_column(String(128), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    state: Mapped[str] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), nullable=True)
    total_holes: Mapped[int] = mapped_column(Integer, nullable=False, default=18)
    source: Mapped[str] = mapped_column(String(64), nullable=False, default="manual")

    holes = relationship("CourseHole", back_populates="course", cascade="all, delete-orphan")
    rounds = relationship("Round", back_populates="course")
