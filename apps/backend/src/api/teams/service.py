from typing import Annotated, Any, Sequence
from uuid import UUID

from fastapi import Depends

from src.api.teams.enum import StatusEnum
from src.api.teams.models import Team
from src.api.teams.queries import TeamQueryParams
from src.api.teams.repository import TeamRepositoryDepends
from src.api.teams.schemas import TeamCreateRequest, TeamUpdateRequest
from src.api.users.models import TeamToUser, User
from src.pagination import PaginationSearchParams


class TeamService:
    def __init__(self, repository: TeamRepositoryDepends) -> None:
        self.repository = repository

    async def create_team(self, args: TeamCreateRequest, lead: User) -> Team:
        team = Team(
            title=args.title,
            about=args.about,
            tasks=args.tasks,
            leader_id=lead.id,
            status=StatusEnum.active,
        )

        team_to_user = TeamToUser(user_id=lead.id, resume_id=args.lead_resume_id)

        return await self.repository.create(team, team_to_user)

    async def get_teams_by_user_id(self, user_id: str | UUID) -> Sequence[Team]:
        return await self.repository.get_by_user_id(user_id)

    async def get_team(self, team_id: str | UUID) -> Team | None:
        return await self.repository.get_by_id(team_id)

    async def get_teams(
        self, search_params: PaginationSearchParams | None = None, query_params: TeamQueryParams | None = None
    ) -> Sequence[Team]:
        return await self.repository.get_all(search_params, query_params)

    async def get_team_members(self, team_id: str | UUID) -> Sequence[User]:
        return await self.repository.get_members(team_id)

    async def update_team(self, team: Team, args: TeamUpdateRequest) -> None:
        data_to_update = args.model_dump()

        team.update(data_to_update)

        await self.repository.update(team)

    async def delete_team(self, team: Team) -> None:
        await self.repository.delete(team)

    async def add_team_member(self, team_id: str | UUID, user_id: str | UUID, resume_id: str | UUID) -> None:
        await self.repository.add_member(team_id, user_id, resume_id)

    async def remove_team_member(self, team: Team, user_to_delete: User) -> None:
        await self.repository.delete_member(team, user_to_delete)

    async def get_teams_with_members_and_resumes(self, team_ids: list[str | UUID]) -> dict[str | UUID, dict[str, Any]]:
        return await self.repository.get_with_members_and_resumes(team_ids)


TeamServiceDepends = Annotated[TeamService, Depends(TeamService)]
