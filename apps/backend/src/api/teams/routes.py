from fastapi import APIRouter, HTTPException, status

from src.api.fields import EntityId
from src.api.resumes.service import ResumeServiceDepends
from src.api.tags import Tag
from src.api.teams.queries import TeamQueryParamsDepends
from src.api.teams.schemas import MemberResponse, TeamAddUserRequest, TeamCreateRequest, TeamResponse, TeamUpdateRequest
from src.api.teams.service import TeamServiceDepends
from src.api.users.me.deps import (
    CurrentUserVerifiedDepends,
    CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
)
from src.api.users.service import UserServiceDepends
from src.pagination import PaginationSearchParamsDepends

router = APIRouter(prefix="/teams", tags=[Tag.TEAMS])


@router.post(
    "",
    responses={
        status.HTTP_201_CREATED: dict(
            model=TeamResponse,
            description="Team successfully created",
        ),
        status.HTTP_403_FORBIDDEN: dict(
            description="Resume does not belong to the current user",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Resume not found",
        ),
    },
    status_code=status.HTTP_201_CREATED,
    response_model=TeamResponse,
)
async def create_team(
    args: TeamCreateRequest,
    service: TeamServiceDepends,
    resume_service: ResumeServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> TeamResponse:
    resume = await resume_service.get_resume_by_id(args.lead_resume_id)

    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if resume.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Resume does not belong to the current user")

    team = await service.create_team(args, user)

    return TeamResponse.from_orm(team, [user], [resume])


@router.get(
    "",
    response_model=list[TeamResponse],
)
async def get_teams(
    search_params: PaginationSearchParamsDepends,
    query_params: TeamQueryParamsDepends,
    service: TeamServiceDepends,
    user: CurrentUserVerifiedDepends,
) -> list[TeamResponse]:
    teams = await service.get_teams(search_params, query_params)
    data = await service.get_teams_with_members_and_resumes([team.id for team in teams])

    print(data)

    return [
        TeamResponse.from_orm(
            data.get(team_id, {}).get("team", None),
            data.get(team_id, {}).get("users", []),
            data.get(team_id, {}).get("resumes", []),
        )
        for team_id in data
        if (
            data.get(team_id, {}).get("team") is not None
            and all([user is not None for user in data.get(team_id, {}).get("users", [])])
            and all([resume is not None for resume in data.get(team_id, {}).get("resumes", [])])
        )
    ]


@router.get(
    "/my/",
    response_model=list[TeamResponse],
)
async def get_my_teams(
    service: TeamServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> list[TeamResponse]:
    teams = await service.get_teams_by_user_id(user.id)
    data = await service.get_teams_with_members_and_resumes([team.id for team in teams])

    return [
        TeamResponse.from_orm(
            data.get(team_id, {}).get("team", None),
            data.get(team_id, {}).get("users", []),
            data.get(team_id, {}).get("resumes", []),
        )
        for team_id in data
    ]


@router.get(
    "/{team_id}",
    response_model=TeamResponse,
    responses={
        status.HTTP_404_NOT_FOUND: dict(
            description="Team not found",
        ),
    },
)
async def get_team(
    team_id: EntityId,
    service: TeamServiceDepends,
    user: CurrentUserVerifiedDepends,
) -> TeamResponse:
    team = await service.get_team(team_id)

    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    data = await service.get_teams_with_members_and_resumes([team.id])
    return TeamResponse.from_orm(team, data.get(team_id, {}).get("users", []), data.get(team_id, {}).get("resumes", []))


@router.put(
    "/{team_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Team successfully updated",
        ),
        status.HTTP_403_FORBIDDEN: dict(
            description="Only team owner can update team",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team not found",
        ),
    },
)
async def update_team(
    args: TeamUpdateRequest,
    team_id: EntityId,
    service: TeamServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> None:
    team = await service.get_team(team_id)

    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if user.id != team.leader_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only team owner can update team")

    await service.update_team(team, args)


@router.delete(
    "/{team_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Team successfully deleted",
        ),
        status.HTTP_403_FORBIDDEN: dict(
            description="Only team owner can delete team",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team not found",
        ),
    },
)
async def delete_team(
    team_id: EntityId, service: TeamServiceDepends, user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends
) -> None:
    team = await service.get_team(team_id)

    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if user.id != team.leader_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only team owner can delete team")

    await service.delete_team(team)


@router.post(
    "/{team_id}/members",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Access denied",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team, user or resume not found",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="User already in team",
        ),
    },
    response_model=TeamResponse,
)
async def add_team_member(
    team_id: EntityId,
    args: TeamAddUserRequest,
    service: TeamServiceDepends,
    user_service: UserServiceDepends,
    resume_service: ResumeServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> TeamResponse:
    team = await service.get_team(team_id)

    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    user_to_add = await user_service.get_user_by_id(args.user_id)

    if user_to_add is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    resume = await resume_service.get_resume_by_id(args.resume_id)

    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if resume.user_id != user_to_add.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Resume does not belong to the user")

    if user.id != team.leader_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only team owner can add members")

    team_members = await service.get_team_members(team.id)

    if user_to_add.id in [member.id for member in team_members]:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already in team")

    await service.add_team_member(team.id, user_to_add.id, resume.id)

    return await get_team(team_id, service, user)


@router.get(
    "/{team_id}/members",
    response_model=list[MemberResponse],
    responses={
        status.HTTP_404_NOT_FOUND: dict(
            description="Team not found",
        ),
    },
)
async def get_team_members(
    team_id: EntityId,
    service: TeamServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> list[MemberResponse]:
    team = await service.get_team(team_id)

    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    data = await service.get_teams_with_members_and_resumes([team.id])

    return [
        MemberResponse.from_orm(u, r)
        for u, r in zip(data.get(team_id, {}).get("users", []), data.get(team_id, {}).get("resumes", []))
    ]


@router.delete(
    "/{team_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Member successfully deleted",
        ),
        status.HTTP_403_FORBIDDEN: dict(
            description="Access denied",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Team or user not found",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="Cannot remove team owner",
        ),
    },
)
async def remove_team_member(
    team_id: EntityId,
    user_id: EntityId,
    team_service: TeamServiceDepends,
    user_service: UserServiceDepends,
    user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> None:
    team = await team_service.get_team(team_id)

    if team is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    user_to_delete = await user_service.get_user_by_id(user_id)

    if user_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user_id != user.id and user.id != team.leader_id:  # только лид может удалять не себя
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only team owner can delete members")

    if user.id == user_id and user.id == team.leader_id:  # лид не может удалить сам себя
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cannot remove team owner")

    await team_service.remove_team_member(team, user_to_delete)
