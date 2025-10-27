__all__ = [
    "settings",
    "AppSettings",
    "ApiSettings",
    "PostgresSettings",
    "SecuritySettings",
    "CORSSettings",
    "SecuritySettings",
    "SwaggerSettings",
]

from typing import Any

from pydantic_settings import BaseSettings, SettingsConfigDict

from src.settings.api import ApiSettings
from src.settings.app import AppSettings
from src.settings.clickhouse import ClickHouseSettings
from src.settings.cors import CORSSettings
from src.settings.otp import OTPSettings
from src.settings.postgres import PostgresSettings
from src.settings.redis import RedisSettings
from src.settings.security import SecuritySettings
from src.settings.smtp import SMTPSettings
from src.settings.swagger import SwaggerSettings


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_nested_delimiter="_",
        env_nested_max_split=1,
        env_prefix="SQUADY_",
        extra="ignore",
    )

    app: AppSettings
    api: ApiSettings
    cors: CORSSettings
    clickhouse: ClickHouseSettings
    email: SMTPSettings
    otp: OTPSettings
    postgres: PostgresSettings
    postgres_test: PostgresSettings
    redis: RedisSettings
    security: SecuritySettings
    swagger: SwaggerSettings

    logging: dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "basic": {
                "class": "uvicorn.logging.ColourizedFormatter",
                "format": "%(levelprefix)s %(message)s",
            },
            "verbose": {
                "format": "%(asctime)s %(pathname)s:%(lineno)d %(levelname)s %(message)s",
                "datefmt": "%d.%m.%Y %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "basic",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "root": {
                "level": "INFO",
                "handlers": ["console"],
            },
            "app": {
                "level": "DEBUG",
                "handlers": ["console"],
            },
            "sqlalchemy.engine": {
                "level": "WARNING",
                "handlers": ["console"],
            },
        },
    }


settings = Settings()  # type: ignore[call-arg]
