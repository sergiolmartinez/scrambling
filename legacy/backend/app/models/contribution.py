from sqlalchemy import Column, Integer, ForeignKey
from app.db import Base


class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    round_id = Column(Integer, ForeignKey(
        "rounds.id", ondelete="CASCADE"), nullable=False)
    hole = Column(Integer, nullable=False)
    shot = Column(Integer, nullable=False)
    player_id = Column(Integer, ForeignKey(
        "players.id", ondelete="CASCADE"), nullable=False)
