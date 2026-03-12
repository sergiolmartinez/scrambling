from datetime import datetime

from sqlalchemy import DateTime, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Course(Base, TimestampMixin):
    __tablename__ = "courses"
    __table_args__ = (
        UniqueConstraint("source", "external_course_id", name="uq_course_source_external_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    external_course_id: Mapped[str] = mapped_column(String(128), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    state: Mapped[str] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), nullable=True)
    total_holes: Mapped[int] = mapped_column(Integer, nullable=False, default=18)
    source: Mapped[str] = mapped_column(String(64), nullable=False, default="manual")
    imported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    external_payload_hash: Mapped[str] = mapped_column(String(64), nullable=True)

    holes = relationship("CourseHole", back_populates="course", cascade="all, delete-orphan")
    rounds = relationship("Round", back_populates="course")
