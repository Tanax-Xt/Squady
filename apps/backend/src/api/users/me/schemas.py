from typing import Literal

from pydantic import BaseModel, Field

from src.api.auth.otp.fields import OneTimePassword
from src.api.users.enums import UserRole
from src.api.users.fields import UserPassword, UserUsername
from src.api.users.schemas import UserResponse


class CurrentUserResponse(UserResponse):
    """Represents the private response data for a user."""


class CurrentUserUsernameUpdateRequest(BaseModel):
    """Represents the user username request details."""

    username: UserUsername


class CurrentUserPasswordUpdateRequest(BaseModel):
    """Represents the user password request details."""

    old_password: UserPassword
    new_password: UserPassword


class CurrentUserRoleUpdateRequest(BaseModel):
    """Represents the user password request details."""

    role: UserRole


class CurrentUserForbiddenResponse(BaseModel):
    subject: Literal[
        "unverified",
        "not_mentor_or_participant",
    ] = Field(
        ...,
        description=("The specific forbidden action for the current user."),
        examples=[
            "unverified",
            "not_mentor_or_participant",
        ],
        json_schema_extra={
            "x-enum-descriptions": [
                "You cannot do this until you are verified.",
                "You cannot do this because you aren't a mentor or participant.",
            ]
        },
    )

    message: str = Field(
        ...,
        description="Human-readable error message describing the conflict.",
        examples=[
            "You cannot do this until you are verified.",
            "You cannot do this because you aren't a mentor or participant.",
        ],
    )


class CurrentUserRoleUpdateForbiddenResponse(BaseModel):
    subject: Literal[
        "to_admin",
        "from_agent",
        "to_agent",
    ] = Field(
        ...,
        description=("The specific forbidden role change for the user."),
        examples=[
            "to_admin",
            "from_agent",
            "to_agent",
        ],
        json_schema_extra={
            "x-enum-descriptions": [
                "You cannot change your role to admin.",
                "You cannot change your role from agent.",
                "You cannot change your role to agent.",
            ]
        },
    )

    message: str = Field(
        ...,
        description="Human-readable error message describing the conflict.",
        examples=[
            "You cannot change your role to admin.",
            "You cannot change your role from agent.",
            "You cannot change your role to agent.",
        ],
    )


class CurrentUserVerifyRequest(BaseModel):
    """Represents a request for verifying a One-Time Password (OTP)."""

    otp: OneTimePassword
