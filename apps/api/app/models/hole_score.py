from sqlalchemy import Boolean, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class HoleScore(Base, TimestampMixin):
    __tablename__ = "hole_scores"
    __table_args__ = (UniqueConstraint("round_id", "hole_number", name="uq_round_hole_score"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    round_id: Mapped[int] = mapped_column(
        ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False
    )
    hole_number: Mapped[int] = mapped_column(Integer, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=True)
    par_snapshot: Mapped[int] = mapped_column(Integer, nullable=True)
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    round = relationship("Round", back_populates="hole_scores")
