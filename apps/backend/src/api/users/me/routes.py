from fastapi import APIRouter, HTTPException, status

from src.api.auth.otp.service import OtpServiceDepends
from src.api.resumes.schemas import ResumesPaginationResponse
from src.api.resumes.service import ResumeServiceDepends
from src.api.teams.service import TeamServiceDepends
from src.api.users.enums import UserRole
from src.api.users.me.deps import CURRENT_USER_DEPENDS_RESPONSES, CurrentUserDepends, CurrentUserVerifiedDepends
from src.api.users.me.schemas import (
    CurrentUserPasswordUpdateRequest,
    CurrentUserResponse,
    CurrentUserRoleUpdateForbiddenResponse,
    CurrentUserRoleUpdateRequest,
    CurrentUserUsernameUpdateRequest,
    CurrentUserVerifyRequest,
)
from src.api.users.me.service import CurrentUserServiceDepends
from src.api.users.schemas import UserStatsResponse
from src.api.users.service import UserServiceDepends
from src.pagination import PaginationSearchParamsDepends
from src.security import is_valid_password

router = APIRouter(prefix="/me", responses=CURRENT_USER_DEPENDS_RESPONSES)


@router.get(
    "",
    response_model=CurrentUserResponse,
    status_code=status.HTTP_200_OK,
)
async def get_current_user(
    current_user: CurrentUserDepends,
    resume_service: ResumeServiceDepends,
    teams_service: TeamServiceDepends,
) -> CurrentUserResponse:
    stats = UserStatsResponse(
        resumes=len(await resume_service.get_resumes_by_user_id(current_user.id, current_user.id)),
        teams=len(await teams_service.get_teams_by_user_id(current_user.id)),
    )

    return CurrentUserResponse(**current_user.__dict__, stats=stats)


@router.patch(
    "/username",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Username successfully updated",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="Username already registered",
        ),
    },
)
async def update_current_user_username(
    args: CurrentUserUsernameUpdateRequest,
    user_service: UserServiceDepends,
    current_user_service: CurrentUserServiceDepends,
    current_user: CurrentUserDepends,
) -> None:
    user = await user_service.get_user_by_username(args.username)

    if user:
        raise HTTPException(status.HTTP_409_CONFLICT, "Username already registered.")

    await current_user_service.update_username(current_user, args.username)


@router.patch(
    "/password",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Password successfully updated",
        ),
    },
)
async def update_current_user_password(
    args: CurrentUserPasswordUpdateRequest,
    current_user_service: CurrentUserServiceDepends,
    current_user: CurrentUserDepends,
) -> None:
    if not is_valid_password(args.old_password, current_user.password):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Incorrect password.")

    await current_user_service.update_password(current_user, args.new_password)


@router.patch(
    "/role",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Role successfully updated",
        ),
    },
)
async def update_current_user_role(
    args: CurrentUserRoleUpdateRequest,
    current_user_service: CurrentUserServiceDepends,
    current_user: CurrentUserVerifiedDepends,
) -> None:
    if args.role == UserRole.admin and current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=CurrentUserRoleUpdateForbiddenResponse(
                subject="to_admin",
                message="You cannot change your role to admin.",
            ).model_dump(),
        )

    if current_user.role == UserRole.agent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=CurrentUserRoleUpdateForbiddenResponse(
                subject="from_agent",
                message="You cannot change your role from agent.",
            ).model_dump(),
        )

    if args.role == UserRole.agent and (current_user.role is not None and current_user.role != UserRole.admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=CurrentUserRoleUpdateForbiddenResponse(
                subject="to_agent",
                message="You cannot change your role to agent.",
            ).model_dump(),
        )

    await current_user_service.update_role(current_user, args.role)


@router.post(
    "/verify",
    status_code=status.HTTP_202_ACCEPTED,
    responses={
        status.HTTP_202_ACCEPTED: dict(
            description="User successfully verified",
        ),
        status.HTTP_406_NOT_ACCEPTABLE: dict(
            description="The One-Time Password (OTP) is incorrect or expired",
        ),
    },
)
async def verify(
    args: CurrentUserVerifyRequest,
    otp_service: OtpServiceDepends,
    current_user_service: CurrentUserServiceDepends,
    current_user: CurrentUserDepends,
) -> None:
    if not await otp_service.is_otp_correct(current_user.email, args.otp):
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, "The One-Time Password (OTP) is incorrect or expired.")

    await current_user_service.verify_user(current_user)


@router.get(
    "/resumes",
    response_model=ResumesPaginationResponse,
    status_code=status.HTTP_200_OK,
)
async def get_current_user_resumes(
    search_params: PaginationSearchParamsDepends,
    resume_service: ResumeServiceDepends,
    current_user: CurrentUserVerifiedDepends,
) -> ResumesPaginationResponse:
    return await resume_service.get_user_resumes_pagination(current_user.id, current_user.id, search_params)
