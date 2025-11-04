import asyncio
import csv
import io
from typing import Annotated, AsyncGenerator, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Row

from src.api.resumes.models import Resume
from src.api.teams.application.enum import ApplicationStatusEnum
from src.api.teams.application.models import ApplicationToTeam
from src.api.teams.application.queries import ApplicationQueryParams
from src.api.teams.application.repository import ApplicationToTeamRepositoryDepends
from src.api.teams.application.schemas import ApplicationMetricsItem, ApplicationMetricsResponse
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

    async def get_metrics_by_team_id(
        self, team_id: str | UUID, query_params: ApplicationQueryParams | None = None
    ) -> ApplicationMetricsResponse:
        return await self.repository.get_metrics(team_id, query_params)

    async def metrics_to_csv_stream(self, metrics: list[ApplicationMetricsItem]) -> AsyncGenerator[bytes, None]:
        yield "\ufeff".encode("utf-8")

        sio = io.StringIO()
        writer = csv.writer(sio)

        writer.writerow(["date", "sent", "accepted", "rejected", "total"])
        yield sio.getvalue().encode("utf-8")
        sio.seek(0)
        sio.truncate(0)

        async def _aiter(iterable: list[ApplicationMetricsItem]) -> AsyncGenerator[ApplicationMetricsItem, None]:
            if hasattr(iterable, "__aiter__"):
                async for item in iterable:
                    yield item
            else:
                for item in iterable:
                    yield item

        async for m in _aiter(metrics):
            date_str = m.date.isoformat()

            writer.writerow([date_str, m.sent, m.accepted, m.rejected, m.total])
            yield sio.getvalue().encode("utf-8")
            sio.seek(0)
            sio.truncate(0)

            await asyncio.sleep(0)


ApplicationToTeamServiceDepends = Annotated[ApplicationToTeamService, Depends(ApplicationToTeamService)]
