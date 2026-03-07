from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class CourseHole(Base, TimestampMixin):
    __tablename__ = "course_holes"
    __table_args__ = (
        UniqueConstraint("course_id", "hole_number", "tee_name", name="uq_course_hole_tee"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    hole_number: Mapped[int] = mapped_column(Integer, nullable=False)
    par: Mapped[int] = mapped_column(Integer, nullable=False)
    yardage: Mapped[int] = mapped_column(Integer, nullable=True)
    handicap: Mapped[int] = mapped_column(Integer, nullable=True)
    tee_name: Mapped[str] = mapped_column(String(64), nullable=False, default="default")

    course = relationship("Course", back_populates="holes")
