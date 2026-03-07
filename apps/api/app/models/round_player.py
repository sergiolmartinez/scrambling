from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, CreatedAtMixin


class RoundPlayer(Base, CreatedAtMixin):
    __tablename__ = "round_players"
    __table_args__ = (
        UniqueConstraint("round_id", "sort_order", name="uq_round_player_sort_order"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    round_id: Mapped[int] = mapped_column(
        ForeignKey("rounds.id", ondelete="CASCADE"), nullable=False
    )
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)

    round = relationship("Round", back_populates="players")
    contributions = relationship("ShotContribution", back_populates="round_player")
