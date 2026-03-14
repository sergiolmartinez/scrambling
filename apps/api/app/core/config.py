import json

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "apps/api/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/scrambling"
    cors_origins: str = "http://localhost:5173"
    golfcourseapi_base_url: str = "https://api.golfcourseapi.com"
    golfcourseapi_api_key: str = ""
    golfcourseapi_timeout_seconds: float = 10.0
    golfcourseapi_cache_ttl_seconds: int = 300
    auth_session_cookie_name: str = "scrambling_session"
    auth_session_secret: str = "change-me-in-production"
    auth_session_ttl_hours: int = 336
    auth_password_hash_iterations: int = 600000

    def cors_origin_list(self) -> list[str]:
        raw_value = self.cors_origins.strip()
        if not raw_value:
            return []

        if raw_value.startswith("["):
            try:
                parsed = json.loads(raw_value)
            except json.JSONDecodeError:
                parsed = []
            if isinstance(parsed, list):
                return [str(origin).strip() for origin in parsed if str(origin).strip()]

        return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


settings = Settings()
