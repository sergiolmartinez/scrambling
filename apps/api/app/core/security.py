import hashlib
import secrets

from app.core.config import settings

PBKDF2_ALGORITHM = "pbkdf2_sha256"
SALT_BYTES = 16
SESSION_TOKEN_BYTES = 32


def hash_password(password: str) -> str:
    salt = secrets.token_hex(SALT_BYTES)
    derived_key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        settings.auth_password_hash_iterations,
    )
    password_hash = derived_key.hex()
    return (
        f"{PBKDF2_ALGORITHM}${settings.auth_password_hash_iterations}"
        f"${salt}${password_hash}"
    )


def verify_password(password: str, encoded_hash: str) -> bool:
    try:
        algorithm, iteration_text, salt, expected_hash = encoded_hash.split("$", maxsplit=3)
    except ValueError:
        return False

    if algorithm != PBKDF2_ALGORITHM:
        return False

    try:
        iterations = int(iteration_text)
    except ValueError:
        return False

    derived_key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    )
    return secrets.compare_digest(derived_key.hex(), expected_hash)


def generate_session_token() -> str:
    return secrets.token_urlsafe(SESSION_TOKEN_BYTES)


def hash_session_token(token: str) -> str:
    digest = hashlib.sha256()
    digest.update(settings.auth_session_secret.encode("utf-8"))
    digest.update(token.encode("utf-8"))
    return digest.hexdigest()
