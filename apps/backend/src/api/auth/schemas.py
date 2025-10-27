from datetime import datetime
from typing import Any, Literal

from pydantic import Field

from src.api.schemas import BaseSchema


class AccessTokenResponse(BaseSchema):
    """Represents a response containing access token and its expiration datetime."""

    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class JWT(BaseSchema):
    """Represents the contents of a [JWT](https://wikipedia.org/wiki/JSON_Web_Token)."""

    exp: datetime | None = None
    sub: Any | None = None


class UserRegistrationConflictResponse(BaseSchema):
    subject: Literal["email", "username"] = Field(
        ...,
        description=("The field that caused the conflict."),
        examples=[
            "email",
            "username",
        ],
        json_schema_extra={
            "x-enum-descriptions": [
                "The email address is already registered.",
                "The username is already taken.",
            ]
        },
    )

    message: str = Field(
        ...,
        description="Human-readable error message describing the conflict.",
        examples=[
            "The email address is already registered.",
            "The username is already taken.",
        ],
    )
