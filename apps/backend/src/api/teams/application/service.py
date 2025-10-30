from typing import Annotated, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Row

from src.api.resumes.models import Resume
from src.api.teams.application.enum import ApplicationStatusEnum
from src.api.teams.application.models import ApplicationToTeam
from src.api.teams.application.repository import ApplicationToTeamRepositoryDepends
from src.api.users.models import User
from src.pagination import PaginationSearchParams


class ApplicationToTeamService:
    def __init__(self, repository: ApplicationToTeamRepositoryDepends) -> None:
        self.repository = repository

    async def create_application_to_team(self, user_id: str | UUID, resume_id: str | UUID, team_id: str | UUID) -> None:
        application = ApplicationToTeam(
            user_id=user_id, resume_id=resume_id, team_id=team_id, status=ApplicationStatusEnum.sent
        )
        await self.repository.create(application)

    async def get_applications(
        self, team_id: str | UUID, search_params: PaginationSearchParams | None = None
    ) -> Sequence[Row[tuple[ApplicationToTeam, User, Resume]]]:
        return await self.repository.get_all_by_team_id(team_id, search_params)

    async def get_application(self, application_id: str | UUID) -> ApplicationToTeam | None:
        return await self.repository.get_by_id(application_id)

    async def update_application_status(self, application: ApplicationToTeam, status: ApplicationStatusEnum) -> None:
        application.status = status
        await self.repository.update(application)

    async def is_user_already_applied(self, user_id: str | UUID, resume_id: str | UUID, team_id: str | UUID) -> bool:
        return await self.repository.is_user_already_applied(user_id, resume_id, team_id)


ApplicationToTeamServiceDepends = Annotated[ApplicationToTeamService, Depends(ApplicationToTeamService)]
