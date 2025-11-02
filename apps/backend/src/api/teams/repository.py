from typing import Annotated, Any, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Select, and_, func, or_, select
from sqlalchemy.orm import selectinload

from src.api.resumes.models import Resume, Skill, resume_to_skill
from src.api.resumes.repository import ResumeRepositoryDepends
from src.api.teams.models import Team
from src.api.teams.queries import TeamQueryParams
from src.api.users.models import TeamToUser, User
from src.db import SessionDepends
from src.pagination import PaginationSearchParams


class TeamRepository:
    def __init__(self, session: SessionDepends, resume_repository: ResumeRepositoryDepends) -> None:
        self.session = session
        self.resume_repository = resume_repository

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

    # async def get_all(self, search_params: PaginationSearchParams | None,
    #                   query_params: TeamQueryParams | None = None) -> Sequence[Team]:
    #     search_params = search_params or PaginationSearchParams.model_construct()
    #     query_params = query_params or TeamQueryParams.model_construct()
    #
    #     stmt = select(Team)
    #     stmt = stmt.filter(Team.title.icontains(search_params.q),
    #                        Team.about.icontains(search_params.q)) if search_params.q else stmt
    #     stmt = self._paginate(stmt, offset=search_params.offset, limit=search_params.limit)
    #
    #     result = await self.session.execute(stmt)
    #
    #     return result.scalars().all()

    async def get_all(
        self, search_params: PaginationSearchParams | None, query_params: TeamQueryParams | None = None
    ) -> Sequence[Team]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query_params = query_params or TeamQueryParams.model_construct()

        stmt = select(Team)

        stmt = (
            stmt.filter(or_(Team.title.icontains(search_params.q), Team.about.icontains(search_params.q)))
            if search_params.q
            else stmt
        )

        exists_clauses = []

        db_skills = await self.resume_repository.create_and_get_skills_by_names(query_params.skills)

        skill_subq = (
            select(1)
            .select_from(TeamToUser)
            .join(Resume, TeamToUser.resume_id == Resume.id)
            .join(resume_to_skill, resume_to_skill.c.resume_id == Resume.id)
            .join(Skill, resume_to_skill.c.skill_id == Skill.id)
            .where(TeamToUser.team_id == Team.id)
            .where(TeamToUser.resume_id.isnot(None))
        )

        skill_filters = []
        if len(db_skills) > 0:
            skill_filters.append(Skill.name.in_([skill.name for skill in db_skills]))

        if len(skill_filters) > 0:
            skill_subq = skill_subq.where(or_(*skill_filters))
            exists_clauses.append(skill_subq.exists())

        if query_params.education_types:
            ed_subq = (
                select(1)
                .select_from(TeamToUser)
                .join(Resume, TeamToUser.resume_id == Resume.id)
                .where(TeamToUser.team_id == Team.id)
                .where(TeamToUser.resume_id.isnot(None))
                .where(func.jsonb_extract_path_text(Resume.education, "type").in_(query_params.education_types))
            )
            exists_clauses.append(ed_subq.exists())

        if exists_clauses:
            stmt = stmt.where(and_(*exists_clauses))

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
