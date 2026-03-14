import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class RoundStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"


class Round(Base, TimestampMixin):
    __tablename__ = "rounds"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[RoundStatus] = mapped_column(
        Enum(
            RoundStatus,
            name="round_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
        default=RoundStatus.DRAFT,
    )
    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id", ondelete="SET NULL"), nullable=True
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    notes: Mapped[str] = mapped_column(String(500), nullable=True)

    course = relationship("Course", back_populates="rounds")
    owner = relationship("User", back_populates="rounds")
    players = relationship("RoundPlayer", back_populates="round", cascade="all, delete-orphan")
    hole_scores = relationship("HoleScore", back_populates="round", cascade="all, delete-orphan")
    shot_contributions = relationship(
        "ShotContribution", back_populates="round", cascade="all, delete-orphan"
    )
