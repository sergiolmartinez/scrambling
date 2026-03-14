from sqlalchemy.orm import Session

from app.models import User
from app.schemas import UserMeUpdateRequest


class UserService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def update_me(self, current_user: User, payload: UserMeUpdateRequest) -> User:
        current_user.display_name = payload.display_name.strip()
        self.db.commit()
        self.db.refresh(current_user)
        return current_user
