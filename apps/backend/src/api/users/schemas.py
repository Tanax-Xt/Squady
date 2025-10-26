from pydantic import BaseModel

from src.api.schemas import AuditBaseModel
from src.api.users.enums import UserRole
from src.api.users.fields import UserAbout, UserEmail, UserId, UserPassword, UserUsername
from src.pagination import PaginationResponse


class UserResponse(AuditBaseModel):
    """Represents the public response data for a user."""

    id: UserId
    username: UserUsername
    email: UserEmail
    role: UserRole | None
    about: UserAbout | None
    is_verified: bool
    is_verified_agent: bool | None


class UsersPaginationResponse(BaseModel):
    """Represents the public response data for a list of users."""

    users: list[UserResponse]
    pagination: PaginationResponse


class UserRegistrationRequest(BaseModel):
    """Represents the user registration details."""

    username: UserUsername
    email: UserEmail
    password: UserPassword
