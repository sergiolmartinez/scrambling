from dataclasses import dataclass

from fastapi import status


@dataclass
class DomainError(Exception):
    code: str
    message: str
    status_code: int = status.HTTP_409_CONFLICT
    details: dict[str, str] | None = None


class NotFoundError(DomainError):
    def __init__(self, message: str, details: dict[str, str] | None = None) -> None:
        super().__init__("not_found", message, status.HTTP_404_NOT_FOUND, details)


class LockedRoundError(DomainError):
    def __init__(self) -> None:
        super().__init__(
            "round_locked", "Completed rounds cannot be edited.", status.HTTP_423_LOCKED
        )


class ValidationError(DomainError):
    def __init__(self, message: str, details: dict[str, str] | None = None) -> None:
        super().__init__("validation_error", message, status.HTTP_400_BAD_REQUEST, details)


class ConflictError(DomainError):
    def __init__(self, message: str, details: dict[str, str] | None = None) -> None:
        super().__init__("conflict", message, status.HTTP_409_CONFLICT, details)


class ExternalServiceError(DomainError):
    def __init__(self, message: str, details: dict[str, str] | None = None) -> None:
        super().__init__("external_service_error", message, status.HTTP_502_BAD_GATEWAY, details)
