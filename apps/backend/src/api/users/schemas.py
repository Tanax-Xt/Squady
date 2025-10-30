from pydantic import NonNegativeInt

from src.api.fields import EntityId
from src.api.schemas import AuditBaseModel, BaseSchema
from src.api.users.enums import UserRole
from src.api.users.fields import UserAbout, UserEmail, UserPassword, UserUsername
from src.api.users.me.personal.schemas import CurrentUserPersonalDataResponse
from src.pagination import PaginationResponse


class UserResponse(AuditBaseModel):
    """Represents the public response data for a user."""

    id: EntityId
    username: UserUsername
    email: UserEmail
    role: UserRole | None
    about: UserAbout | None
    is_verified: bool
    is_verified_agent: bool | None


class UserPersonalDataResponse(UserResponse, CurrentUserPersonalDataResponse):
    """Represents the public response data for a user with personal data."""


class UsersPaginationResponse(BaseSchema):
    """Represents the public response data for a list of users."""

    users: list[UserResponse]
    pagination: PaginationResponse


class UserRegistrationRequest(BaseSchema):
    """Represents the user registration details."""

    username: UserUsername
    email: UserEmail
    password: UserPassword


class UserStatsResponse(BaseSchema):
    """Represents the user stats details."""

    resumes: NonNegativeInt
    teams: NonNegativeInt
