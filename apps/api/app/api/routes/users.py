from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models import User
from app.schemas import AuthUserRead, UserMeUpdateRequest
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=AuthUserRead)
def get_me(current_user: User = Depends(get_current_user)) -> AuthUserRead:
    return current_user


@router.patch("/me", response_model=AuthUserRead)
def update_me(
    payload: UserMeUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AuthUserRead:
    return UserService(db).update_me(current_user, payload)
