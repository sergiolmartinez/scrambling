from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    round_id = Column(Integer, ForeignKey(
        "rounds.id", ondelete="CASCADE"), nullable=False)

    # Optional: relationship back to round
    round = relationship("Round", back_populates="players")
