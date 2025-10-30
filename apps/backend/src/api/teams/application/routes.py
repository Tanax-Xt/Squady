from fastapi import APIRouter, HTTPException, Request, status

from src.api.fields import EntityId
from src.api.resumes.service import ResumeServiceDepends
from src.api.teams.application.enum import ApplicationStatusEnum
from src.api.teams.application.mailings import ApplicationToTeamMailingServiceDepends
from src.api.teams.application.schemas import (
    ApplicationCreateRequest,
    ApplicationResponse,
    ApplicationSendEmailRequest,
    ApplicationUpdateRequest,
)
from src.api.teams.application.service import ApplicationToTeamServiceDepends
from src.api.teams.service import TeamServiceDepends
from src.api.users.me.deps import (
    CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
)
from src.api.users.service import UserServiceDepends
from src.pagination import PaginationSearchParamsDepends

router = APIRouter(prefix="/{team_id}/applications")


@router.post(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Resume does not belong to the current user",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team or resume not found",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="Application already sent",
        ),
    },
)
async def add_application(
    team_id: EntityId,
    args: ApplicationCreateRequest,
    service: ApplicationToTeamServiceDepends,
    team_service: TeamServiceDepends,
    resume_service: ResumeServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> None:
    team = await team_service.get_team(team_id)
    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    resume = await resume_service.get_resume_by_id(args.resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if resume.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Resume does not belong to the current user")

    team_members = await team_service.get_team_members(team_id)
    if any(member.id == user.id for member in team_members):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already in team")

    if await service.is_user_already_applied(user.id, resume.id, team.id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Application already sent")

    await service.create_application_to_team(user.id, resume.id, team.id)


@router.get(
    "",
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Only team owner can get applications",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team not found",
        ),
    },
    response_model=list[ApplicationResponse],
)
async def get_applications(
    team_id: EntityId,
    search_params: PaginationSearchParamsDepends,
    service: ApplicationToTeamServiceDepends,
    team_service: TeamServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> list[ApplicationResponse]:
    team = await team_service.get_team(team_id)
    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if user.id != team.leader_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only team owner can get applications")

    data = await service.get_applications(team_id, search_params)
    applications = [ApplicationResponse.from_orm(application, user, resume) for application, user, resume in data]

    return applications


@router.patch(
    "/{application_id}/status",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Only team owner can update applications",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team or application not found",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="Only sent applications can be updated",
        ),
    },
)
async def update_application_status(
    team_id: EntityId,
    application_id: EntityId,
    service: ApplicationToTeamServiceDepends,
    team_service: TeamServiceDepends,
    args: ApplicationUpdateRequest,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> None:
    team = await team_service.get_team(team_id)
    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    application = await service.get_application(application_id)
    if application is None or application.team_id != team.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if user.id != team.leader_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only team owner can update applications")

    if application.status != ApplicationStatusEnum.sent:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Only sent applications can be updated")

    await service.update_application_status(application, args.status)

    if args.status == ApplicationStatusEnum.accepted:
        await team_service.add_team_member(team.id, application.user_id, application.resume_id)


@router.post(
    "/send",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Only team owner can send applications",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team or user not found",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="User already in team",
        ),
    },
)
async def send_application(
    request: Request,
    team_id: EntityId,
    args: ApplicationSendEmailRequest,
    user_service: UserServiceDepends,
    team_service: TeamServiceDepends,
    mail_service: ApplicationToTeamMailingServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> None:
    team = await team_service.get_team(team_id)
    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    user_to_send = await user_service.get_user_by_email(args.email)
    if user_to_send is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id != team.leader_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only team owner can send applications")

    team_members = await team_service.get_team_members(team_id)
    if any(member.id == user_to_send.id for member in team_members):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already in team")

    await mail_service.send_application_message(
        user_to_send.email, team, f"{request.url.scheme}://{request.url.hostname}"
    )
