from typing import Annotated, Any

import jwt
from fastapi import Depends, HTTPException, status

from src.api.auth.deps import PasswordBearerDepends
from src.api.auth.schemas import JWT
from src.api.users.enums import UserRole
from src.api.users.me.schemas import CurrentUserForbiddenResponse
from src.api.users.models import User
from src.db import SessionDepends
from src.settings import settings


async def get_current_user(session: SessionDepends, raw: PasswordBearerDepends) -> User:
    try:
        data = JWT(**jwt.decode(raw, settings.security.jwt_secret, algorithms=[settings.security.jwt_algorithm]))
    except Exception:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Failed to verify credentials") from None

    user = await session.get(User, data.sub)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    return user


CurrentUserDepends = Annotated[User, Depends(get_current_user)]

CURRENT_USER_DEPENDS_RESPONSES: dict[int | str, dict[str, Any]] = {
    status.HTTP_403_FORBIDDEN: dict(
        description="Failed to verify credentials",
    ),
    status.HTTP_404_NOT_FOUND: dict(
        description="User not found",
    ),
}


async def get_current_user_verified(current_user: CurrentUserDepends) -> User:
    if current_user.is_verified is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=CurrentUserForbiddenResponse(
                subject="unverified",
                message="You cannot do this until you are verified.",
            ).model_dump(),
        )

    return current_user


CurrentUserVerifiedDepends = Annotated[User, Depends(get_current_user_verified)]


async def get_current_user_verified_participant_or_mentor(current_user: CurrentUserVerifiedDepends) -> User:
    if current_user.role != UserRole.participant and current_user.role != UserRole.mentor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=CurrentUserForbiddenResponse(
                subject="not_mentor_or_participant",
                message="You cannot do this because you aren't a mentor or participant.",
            ).model_dump(),
        )

    return current_user


CurrentUserVerifiedParticipantOrMentorDepends = Annotated[
    User, Depends(get_current_user_verified_participant_or_mentor)
]


async def get_current_user_admin(current_user: CurrentUserDepends) -> User:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    return current_user


CurrentUserAdminDepends = Annotated[User, Depends(get_current_user_admin)]

CURRENT_USER_ADMIN_DEPENDS_RESPONSES: dict[int | str, dict[str, Any]] = CURRENT_USER_DEPENDS_RESPONSES
