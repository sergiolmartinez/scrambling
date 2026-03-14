from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models import User
from app.schemas import AuthSignInRequest, AuthSignUpRequest, AuthUserRead
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.auth_session_cookie_name,
        value=token,
        httponly=True,
        secure=settings.app_env == "production",
        samesite="lax",
        max_age=settings.auth_session_ttl_hours * 3600,
        path="/",
    )


def _clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.auth_session_cookie_name,
        httponly=True,
        secure=settings.app_env == "production",
        samesite="lax",
        path="/",
    )


@router.post("/sign-up", response_model=AuthUserRead, status_code=status.HTTP_201_CREATED)
def sign_up(
    payload: AuthSignUpRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthUserRead:
    user, token = AuthService(db).sign_up(payload)
    _set_auth_cookie(response, token)
    return user


@router.post("/sign-in", response_model=AuthUserRead)
def sign_in(
    payload: AuthSignInRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AuthUserRead:
    user, token = AuthService(db).sign_in(payload)
    _set_auth_cookie(response, token)
    return user


@router.post("/sign-out", status_code=status.HTTP_204_NO_CONTENT)
def sign_out(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> None:
    session_token = request.cookies.get(settings.auth_session_cookie_name)
    if session_token is not None:
        AuthService(db).sign_out(session_token)
    _clear_auth_cookie(response)


@router.get("/me", response_model=AuthUserRead)
def get_current_user_profile(current_user: User = Depends(get_current_user)) -> AuthUserRead:
    return current_user
