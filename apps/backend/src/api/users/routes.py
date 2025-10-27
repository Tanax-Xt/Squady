from fastapi import APIRouter, HTTPException, status

from src.api.resumes.schemas import ResumesPaginationResponse
from src.api.resumes.service import ResumeServiceDepends
from src.api.tags import Tag
from src.api.users import me
from src.api.users.fields import UserUsername
from src.api.users.me.deps import CurrentUserVerifiedDepends
from src.api.users.models import User
from src.api.users.schemas import UserResponse, UsersPaginationResponse
from src.api.users.service import UserServiceDepends
from src.pagination import PaginationResponse, PaginationSearchParamsDepends

router = APIRouter(prefix="/users", tags=[Tag.USERS])
router.include_router(me.router)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=UsersPaginationResponse,
    responses={
        status.HTTP_404_NOT_FOUND: dict(
            description="No users found matching the provided search parameters",
        ),
    },
)
async def get_users(
    search_params: PaginationSearchParamsDepends, service: UserServiceDepends
) -> UsersPaginationResponse:
    users = await service.get_users(search_params)

    if not users:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No users found matching the provided search parameters.")

    users_count = await service.get_users_count(search_params)

    pagination = PaginationResponse.from_search_params(search_params, total_items=users_count)
    users_response = [UserResponse.model_validate(user, from_attributes=True) for user in users]

    return UsersPaginationResponse(users=users_response, pagination=pagination)


@router.get(
    "/{username}",
    status_code=status.HTTP_200_OK,
    response_model=UserResponse,
    responses={
        status.HTTP_404_NOT_FOUND: dict(
            description="No user found with the provided username",
        ),
    },
)
async def get_user(username: UserUsername, service: UserServiceDepends) -> User:
    user = await service.get_user_by_username(username)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"No user found with the username '{username}'.")

    return user


@router.get(
    "/{username}/resumes",
    status_code=status.HTTP_200_OK,
    response_model=ResumesPaginationResponse,
    responses={
        status.HTTP_404_NOT_FOUND: dict(
            description="No user found with the provided username",
        ),
    },
)
async def get_user_resumes(
    search_params: PaginationSearchParamsDepends,
    username: UserUsername,
    user_service: UserServiceDepends,
    resume_service: ResumeServiceDepends,
    current_user: CurrentUserVerifiedDepends,
) -> ResumesPaginationResponse:
    user = await get_user(username, user_service)

    return await resume_service.get_user_resumes_pagination(user.id, current_user.id, search_params)
