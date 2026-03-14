from typing import Annotated

from fastapi import Cookie, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models import User
from app.services.auth_service import AuthService
from app.services.errors import UnauthorizedError

DbSession = Annotated[Session, Depends(get_db)]
SessionCookie = Annotated[str | None, Cookie(alias=settings.auth_session_cookie_name)]


def get_current_user(
    db: DbSession,
    session_token: SessionCookie = None,
) -> User:
    if session_token is None:
        raise UnauthorizedError()
    return AuthService(db).get_user_for_token(session_token)
