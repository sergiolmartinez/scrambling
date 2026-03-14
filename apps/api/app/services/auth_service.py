from datetime import UTC, datetime, timedelta

from sqlalchemy import and_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    generate_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)
from app.models import AuthSession, User
from app.schemas import AuthSignInRequest, AuthSignUpRequest
from app.services.errors import ConflictError, UnauthorizedError, ValidationError


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def sign_up(self, payload: AuthSignUpRequest) -> tuple[User, str]:
        normalized_email = self._normalize_email(payload.email)
        if self._user_exists(normalized_email):
            raise ConflictError("An account with this email already exists.")

        user = User(
            email=normalized_email,
            display_name=payload.display_name.strip(),
            password_hash=hash_password(payload.password),
        )
        self.db.add(user)
        try:
            self.db.commit()
        except IntegrityError as exc:
            self.db.rollback()
            raise ConflictError("An account with this email already exists.") from exc

        self.db.refresh(user)
        token = self._create_session(user.id)
        return user, token

    def sign_in(self, payload: AuthSignInRequest) -> tuple[User, str]:
        normalized_email = self._normalize_email(payload.email)
        user = (
            self.db.execute(select(User).where(User.email == normalized_email))
            .scalar_one_or_none()
        )
        if user is None or not verify_password(payload.password, user.password_hash):
            raise UnauthorizedError("Invalid email or password.")

        token = self._create_session(user.id)
        return user, token

    def sign_out(self, token: str) -> None:
        token_hash = hash_session_token(token)
        session = self.db.execute(
            select(AuthSession).where(AuthSession.token_hash == token_hash)
        ).scalar_one_or_none()
        if session is None:
            return

        session.revoked_at = datetime.now(UTC)
        self.db.commit()

    def get_user_for_token(self, token: str) -> User:
        token_hash = hash_session_token(token)
        now = datetime.now(UTC)
        session = self.db.execute(
            select(AuthSession)
            .join(User, User.id == AuthSession.user_id)
            .where(
                and_(
                    AuthSession.token_hash == token_hash,
                    AuthSession.revoked_at.is_(None),
                    AuthSession.expires_at > now,
                )
            )
        ).scalar_one_or_none()
        if session is None:
            raise UnauthorizedError()

        return session.user

    def _create_session(self, user_id: int) -> str:
        raw_token = generate_session_token()
        token_hash = hash_session_token(raw_token)
        expires_at = datetime.now(UTC) + timedelta(hours=settings.auth_session_ttl_hours)
        session = AuthSession(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        self.db.add(session)
        self.db.commit()
        return raw_token

    def _user_exists(self, email: str) -> bool:
        existing_user_id = (
            self.db.execute(select(User.id).where(User.email == email))
            .scalar_one_or_none()
        )
        return existing_user_id is not None

    @staticmethod
    def _normalize_email(email: str) -> str:
        normalized = email.strip().lower()
        if "@" not in normalized:
            raise ValidationError("Enter a valid email address.")
        return normalized
