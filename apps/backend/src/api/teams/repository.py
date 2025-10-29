from typing import Annotated, Any, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Select, select
from sqlalchemy.orm import selectinload

from src.api.resumes.models import Resume
from src.api.teams.models import Team
from src.api.users.models import TeamToUser, User
from src.db import SessionDepends
from src.pagination import PaginationSearchParams


class TeamRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    async def create(self, team: Team, team_to_user: TeamToUser) -> Team:
        self.session.add(team)

        await self.session.commit()
        await self.session.refresh(team)

        self.session.add(team_to_user)
        team_to_user.team_id = team.id  # type: ignore
        await self.session.commit()

        return team

    async def update(self, team: Team) -> None:
        await self.session.commit()
        await self.session.refresh(team)

    async def delete(self, team: Team) -> None:
        await self.session.delete(team)
        await self.session.commit()

    async def get_all(self, search_params: PaginationSearchParams | None) -> Sequence[Team]:
        search_params = search_params or PaginationSearchParams.model_construct()

        stmt = select(Team)
        stmt = stmt.filter(Team.title.icontains(search_params.q)) if search_params.q else stmt
        stmt = self._paginate(stmt, offset=search_params.offset, limit=search_params.limit)

        result = await self.session.execute(stmt)

        return result.scalars().all()

    async def get_by_id(self, team_id: str | UUID) -> Team | None:
        stmt = select(Team).where(Team.id == team_id)
        result = await self.session.execute(stmt)
        return result.scalars().one_or_none()

    async def get_by_user_id(self, user_id: str | UUID) -> Sequence[Team]:
        stmt = select(Team).join(TeamToUser, TeamToUser.team_id == Team.id).where(TeamToUser.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_members(self, team_id: str | UUID) -> Sequence[User]:
        stmt = select(User).join(TeamToUser, TeamToUser.user_id == User.id).where(TeamToUser.team_id == team_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def add_member(self, team_id: str | UUID, user_id: str | UUID, resume_id: str | UUID) -> None:
        team_to_user = TeamToUser(team_id=team_id, user_id=user_id, resume_id=resume_id)
        self.session.add(team_to_user)
        await self.session.commit()

    async def delete_member(self, team: Team, user_to_delete: User) -> None:
        stmt = select(TeamToUser).where(TeamToUser.team_id == team.id, TeamToUser.user_id == user_to_delete.id)
        result = await self.session.execute(stmt)
        team_to_user = result.scalars().one_or_none()
        if team_to_user is not None:
            await self.session.delete(team_to_user)
            await self.session.commit()

    async def get_with_members_and_resumes(self, team_ids: list[str | UUID]) -> dict[str | UUID, dict[str, Any]]:
        stmt = (
            select(Team, User, Resume)
            .select_from(Team)
            .outerjoin(TeamToUser, Team.id == TeamToUser.team_id)
            .outerjoin(User, User.id == TeamToUser.user_id)
            .outerjoin(Resume, Resume.id == TeamToUser.resume_id)
            .options(selectinload(Resume.role), selectinload(Resume.skills))
            .where(Team.id.in_(team_ids))
            .order_by(Team.id)
        )

        result = await self.session.execute(stmt)
        rows = result.all()

        out = {}

        for team, user, resume in rows:
            if team.id not in out:
                out[team.id] = {
                    "team": team,
                    "users": [user],
                    "resumes": [resume],
                }
            else:
                out[team.id]["users"].append(user)
                out[team.id]["resumes"].append(resume)

        return out

    def _paginate[T: Any](self, statement: Select[T], *, offset: int, limit: int) -> Select[T]:
        return statement.offset(offset).limit(limit)


TeamRepositoryDepends = Annotated[TeamRepository, Depends(TeamRepository)]
