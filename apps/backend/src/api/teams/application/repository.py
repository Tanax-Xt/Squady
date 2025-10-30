from typing import Annotated, Any, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Row, Select, select
from sqlalchemy.orm import selectinload

from src.api.resumes.models import Resume
from src.api.teams.application.enum import ApplicationStatusEnum
from src.api.teams.application.models import ApplicationToTeam
from src.api.users.models import User
from src.db import SessionDepends
from src.pagination import PaginationSearchParams


class ApplicationToTeamRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    async def create(self, application: ApplicationToTeam) -> None:
        self.session.add(application)
        await self.session.commit()

    async def update(self, application: ApplicationToTeam) -> None:
        await self.session.commit()
        await self.session.refresh(application)

    async def get_all_by_team_id(
        self, team_id: str | UUID, search_params: PaginationSearchParams | None = None
    ) -> Sequence[Row[tuple[ApplicationToTeam, User, Resume]]]:
        search_params = search_params or PaginationSearchParams.model_construct()
        stmt = (
            select(ApplicationToTeam, User, Resume)
            .select_from(ApplicationToTeam)
            .outerjoin(User, User.id == ApplicationToTeam.user_id)
            .outerjoin(Resume, Resume.id == ApplicationToTeam.resume_id)
            .options(selectinload(Resume.role), selectinload(Resume.skills))
            .where(ApplicationToTeam.team_id == team_id)
        )

        stmt = self._paginate(stmt, offset=search_params.offset, limit=search_params.limit)

        result = await self.session.execute(stmt)
        rows = result.all()

        return rows

    async def get_by_id(self, application_id: str | UUID) -> ApplicationToTeam | None:
        stmt = select(ApplicationToTeam).where(ApplicationToTeam.id == application_id)
        result = await self.session.execute(stmt)
        return result.scalars().one_or_none()

    async def is_user_already_applied(self, user_id: str | UUID, resume_id: str | UUID, team_id: str | UUID) -> bool:
        stmt = select(ApplicationToTeam).where(
            ApplicationToTeam.user_id == user_id,
            ApplicationToTeam.resume_id == resume_id,
            ApplicationToTeam.team_id == team_id,
            ApplicationToTeam.status == ApplicationStatusEnum.sent,
        )
        result = await self.session.execute(stmt)
        return bool(result.scalars().one_or_none())

    def _paginate[T: Any](self, statement: Select[T], *, offset: int, limit: int) -> Select[T]:
        return statement.offset(offset).limit(limit)


ApplicationToTeamRepositoryDepends = Annotated[ApplicationToTeamRepository, Depends(ApplicationToTeamRepository)]
