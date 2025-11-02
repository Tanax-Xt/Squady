from typing import Literal

from pydantic import Field

from src.api.auth.otp.fields import OneTimePassword
from src.api.schemas import BaseSchema
from src.api.users.enums import UserRole
from src.api.users.fields import UserPassword, UserUsername
from src.api.users.me.personal.schemas import CurrentUserPersonalDataResponse
from src.api.users.schemas import UserResponse, UserStatsResponse


class CurrentUserResponse(UserResponse, CurrentUserPersonalDataResponse):
    """Represents the private response data for a user."""

    stats: UserStatsResponse


class CurrentUserUsernameUpdateRequest(BaseSchema):
    """Represents the user username request details."""

    username: UserUsername


class CurrentUserPasswordUpdateRequest(BaseSchema):
    """Represents the user password request details."""

    old_password: UserPassword
    new_password: UserPassword


class CurrentUserRoleUpdateRequest(BaseSchema):
    """Represents the user password request details."""

    role: UserRole


class CurrentUserForbiddenResponse(BaseSchema):
    subject: Literal[
        "unverified",
        "not_mentor_or_participant",
        "no_personal_data",
        "unverified_agent",
    ] = Field(
        ...,
        description=("The specific forbidden action for the current user."),
        examples=[
            "unverified",
            "not_mentor_or_participant",
            "no_personal_data",
            "unverified_agent",
        ],
        json_schema_extra={
            "x-enum-descriptions": [
                "You cannot do this until you are verified.",
                "You cannot do this because you aren't a mentor or participant.",
                "You cannot do this because you don't have personal data.",
                "You cannot do this until you are verified as an agent.",
            ]
        },
    )

    message: str = Field(
        ...,
        description="Human-readable error message describing the conflict.",
        examples=[
            "You cannot do this until you are verified.",
            "You cannot do this because you aren't a mentor or participant.",
            "You cannot do this because you don't have personal data.",
            "You cannot do this until you are verified as an agent.",
        ],
    )


class CurrentUserRoleUpdateForbiddenResponse(BaseSchema):
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


class CurrentUserVerifyRequest(BaseSchema):
    """Represents a request for verifying a One-Time Password (OTP)."""

    otp: OneTimePassword
