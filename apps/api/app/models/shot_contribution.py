from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, CreatedAtMixin


class ShotContribution(Base, CreatedAtMixin):
    __tablename__ = "shot_contributions"
    __table_args__ = (
        UniqueConstraint(
            "round_id",
            "hole_number",
            "shot_number",
            "round_player_id",
            name="uq_round_hole_shot_player",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    round_id: Mapped[int] = mapped_column(
        ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False
    )
    hole_number: Mapped[int] = mapped_column(Integer, nullable=False)
    shot_number: Mapped[int] = mapped_column(Integer, nullable=False)
    round_player_id: Mapped[int] = mapped_column(
        ForeignKey("round_players.id", ondelete="CASCADE"), nullable=False
    )
    shot_type: Mapped[str] = mapped_column(String(64), nullable=True)

    round = relationship("Round", back_populates="shot_contributions")
    round_player = relationship("RoundPlayer", back_populates="contributions")
