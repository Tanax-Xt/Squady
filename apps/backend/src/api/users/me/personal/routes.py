from fastapi import APIRouter, HTTPException, status

from src.api.users.me.deps import CurrentUserVerifiedParticipantOrMentorDepends
from src.api.users.me.personal.schemas import (
    CurrentUserPersonalDataRequest,
    CurrentUserPersonalDataResponse,
    CurrentUserPersonalDataUpdateRequest,
)
from src.api.users.me.service import CurrentUserServiceDepends
from src.api.users.models import User

router = APIRouter(prefix="/personal")


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=CurrentUserPersonalDataResponse,
)
async def get_current_user_personal_data(current_user: CurrentUserVerifiedParticipantOrMentorDepends) -> User:
    return current_user


@router.post(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Personal data has been successfully set",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="Immutable personal data has already been set",
        ),
    },
)
async def set_current_user_personal_data(
    personal_data: CurrentUserPersonalDataRequest,
    current_user_service: CurrentUserServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorDepends,
) -> None:
    if current_user.full_name is not None and current_user.birth_date is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Immutable personal data has already been set; please use PATCH instead."
        )

    await current_user_service.update_user_personal_data(current_user, personal_data)


@router.patch(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Mutable personal data has been successfully updated",
        ),
    },
)
async def update_current_user_personal_data(
    personal_data: CurrentUserPersonalDataUpdateRequest,
    current_user_service: CurrentUserServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorDepends,
) -> None:
    await current_user_service.update_user_personal_data(current_user, personal_data)
