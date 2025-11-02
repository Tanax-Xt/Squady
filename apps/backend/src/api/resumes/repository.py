from typing import Annotated, Any, Sequence, cast
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Select, case, distinct, func, select, text
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from src.api.resumes.filter_utils import _experience_years_from_json
from src.api.resumes.models import Resume, Role, Skill
from src.api.resumes.queries import ResumeQueryParams
from src.api.users.models import TeamToUser
from src.db import SessionDepends
from src.pagination import PaginationSearchParams
from src.settings import settings


class ResumeRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    async def create(self, resume: Resume) -> Resume:
        self.session.add(resume)

        await self.session.commit()
        await self.session.refresh(resume)

        statement = Resume.select_with_relations().where(Resume.id == resume.id)

        result = await self.session.execute(statement)

        return cast(Resume, result.scalar_one())

    async def update(self, resume: Resume) -> None:
        await self.session.commit()
        await self.session.refresh(resume)

    async def get_by_id(self, id: str | UUID) -> Resume | None:
        statement = Resume.select_with_relations().where(Resume.id == id)

        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def get_by_user_id_and_role(self, user_id: str | UUID, role: str) -> Resume | None:
        db_role = await self.create_and_get_role_by_name(role)

        statement = select(Resume).where(Resume.user_id == user_id, Resume.role == db_role)
        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def get_by_user_id(
        self, user_id: str | UUID, requester_user_id: str | UUID, search_params: PaginationSearchParams | None = None
    ) -> Sequence[Resume]:
        search_params = search_params or PaginationSearchParams.model_construct()

        statement = Resume.select_with_relations().where(Resume.user_id == user_id)

        if requester_user_id != user_id:
            statement = statement.where(Resume.is_public)

        statement = self._filter(statement, q=search_params.q)
        statement = self._paginate(statement, offset=search_params.offset, limit=search_params.limit)

        result = await self.session.execute(statement)

        return result.scalars().all()

    async def get_count(
        self, user_id: str | UUID, requester_user_id: str | UUID, search_params: PaginationSearchParams | None = None
    ) -> int:
        search_params = search_params or PaginationSearchParams.model_construct()

        statement = select(func.count()).select_from(Resume)
        if requester_user_id != user_id:
            statement = statement.where(Resume.is_public)

        statement = self._filter(statement, q=search_params.q)
        result = await self.session.scalar(statement)

        return result if result is not None else 0

    async def create_and_get_role_by_name(self, name: str) -> Role:
        statement = select(Role).where(func.lower(Role.name) == name.lower())  # ilike() doesn't work

        result = await self.session.execute(statement)

        role = result.scalar_one_or_none()

        if role is None:
            role = Role(name=name)
            self.session.add(role)
            try:
                await self.session.commit()
            except IntegrityError:
                await self.session.rollback()
                result = await self.session.execute(statement)
                role = result.scalar_one()

        return role

    async def create_and_get_skills_by_names(self, names: list[str] | None) -> Sequence[Skill]:
        try:
            stmt = insert(Skill).values([{"name": name} for name in names])  # type: ignore
            stmt = stmt.on_conflict_do_nothing(index_elements=[func.lower(Skill.name)])
            await self.session.execute(stmt)
            await self.session.commit()

            statement = select(Skill).where(func.lower(Skill.name).in_([name.lower() for name in names]))  # type: ignore
            result = await self.session.execute(statement)
            existing: Sequence[Skill] = result.scalars().all()

            return existing
        except Exception:
            return []

    async def bulk_create_roles(self, names: list[str]) -> None:
        stmt = insert(Role).values([{"name": name} for name in names])
        stmt = stmt.on_conflict_do_nothing(index_elements=[func.lower(Role.name)])
        await self.session.execute(stmt)
        await self.session.commit()

    async def delete(self, resume: Resume) -> None:
        await self.session.delete(resume)
        await self.session.commit()

    async def get_roles_names_with_pagination(
        self, search_params: PaginationSearchParams | None = None
    ) -> Sequence[str]:
        search_params = search_params or PaginationSearchParams.model_construct()

        statement = select(Role.name)
        statement = statement.filter(Role.name.icontains(search_params.q)) if search_params.q else statement
        statement = self._paginate(statement, offset=search_params.offset, limit=search_params.limit)

        result = await self.session.execute(statement)

        return result.scalars().all()

    async def get_skills_names_with_pagination(
        self, search_params: PaginationSearchParams | None = None
    ) -> Sequence[str]:
        search_params = search_params or PaginationSearchParams.model_construct()

        statement = select(Skill.name)
        statement = statement.filter(Skill.name.icontains(search_params.q)) if search_params.q else statement
        statement = self._paginate(statement, offset=search_params.offset, limit=search_params.limit)

        result = await self.session.execute(statement)

        return result.scalars().all()

    async def get_by_ids(self, ids: list[str | UUID]) -> Sequence[Resume]:
        statement = select(Resume).where(Resume.id.in_(ids))
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_by_user_and_team_ids(self, user_id: str | UUID, team_id: str | UUID) -> Resume | None:
        statement = select(TeamToUser).where(TeamToUser.user_id == user_id, TeamToUser.team_id == team_id)
        result = await self.session.execute(statement)
        team_to_user = result.scalars().one_or_none()
        if team_to_user is None:
            return None
        stmt = (
            select(Resume)
            .where(Resume.id == team_to_user.resume_id)
            .options(selectinload(Resume.role), selectinload(Resume.skills))
        )
        result_out = await self.session.execute(stmt)
        return result_out.scalars().one_or_none()

    async def get_all_with_params(
        self,
        user_id: str | UUID,
        search_params: PaginationSearchParams | None = None,
        query_params: ResumeQueryParams | None = None,
    ) -> Sequence[Resume]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query_params = query_params or ResumeQueryParams.model_construct()

        base_stmt = select(Resume).where(Resume.user_id != user_id, Resume.is_public)

        if query_params.skills:
            db_skills = await self.create_and_get_skills_by_names(query_params.skills)
            skills = [skill.name for skill in db_skills]
            base_stmt = (
                base_stmt.join(Resume.skills)
                .where(Skill.name.in_(skills))
                .group_by(Resume.id)
                .having(func.count(distinct(Skill.id)) == len(skills))
            )

        if query_params.education_types:
            base_stmt = base_stmt.where(
                func.jsonb_extract_path_text(Resume.education, "type").in_(query_params.education_types)
            )

        experience_array = case(
            (func.jsonb_typeof(Resume.experience) == "array", Resume.experience), else_=text("'[]'::jsonb")
        )

        if query_params.projects_count_from is not None:
            base_stmt = base_stmt.where(func.jsonb_array_length(experience_array) >= query_params.projects_count_from)

        if query_params.projects_count_to is not None:
            base_stmt = base_stmt.where(func.jsonb_array_length(experience_array) <= query_params.projects_count_to)

        base_stmt = base_stmt.options(selectinload(Resume.role), selectinload(Resume.skills), selectinload(Resume.user))

        needs_post_filter = (
            query_params.experience_years_from is not None or query_params.experience_years_to is not None
        )

        if search_params.q:
            base_stmt = self._filter(base_stmt, q=search_params.q)

        if not needs_post_filter:
            stmt = self._paginate(base_stmt, offset=search_params.offset, limit=search_params.limit)
            result = await self.session.execute(stmt)
            return result.scalars().unique().all()

        desired_count = search_params.offset + search_params.limit
        accumulated: list[Resume] = []
        fetch_offset = 0
        batch_size = search_params.limit
        total_fetched = 0

        while len(accumulated) < desired_count and total_fetched < settings.postgres.max_total_fetch:
            stmt = base_stmt.limit(batch_size).offset(fetch_offset)
            result = await self.session.execute(stmt)
            batch = result.scalars().unique().all()
            if not batch:
                break

            total_fetched += len(batch)
            fetch_offset += len(batch)

            for r in batch:
                exp_json = r.experience or []
                years = _experience_years_from_json(exp_json)
                projects_count = len(exp_json)

                ok_year_from = True
                ok_year_to = True
                if query_params.experience_years_from is not None:
                    ok_year_from = years >= float(query_params.experience_years_from)
                if query_params.experience_years_to is not None:
                    ok_year_to = years <= float(query_params.experience_years_to)

                ok_projects_from = True
                ok_projects_to = True
                if query_params.projects_count_from is not None:
                    ok_projects_from = projects_count >= int(query_params.projects_count_from)
                if query_params.projects_count_to is not None:
                    ok_projects_to = projects_count <= int(query_params.projects_count_to)

                if ok_year_from and ok_year_to and ok_projects_from and ok_projects_to:
                    accumulated.append(r)

        return accumulated[search_params.offset : search_params.offset + search_params.limit]

    def _filter[T: Any](self, statement: Select[T], *, q: str | None = None) -> Select[T]:
        if not q:
            return statement

        statement = statement.join(Resume.role)

        return statement.filter(Role.name.icontains(q))

    def _paginate[T: Any](self, statement: Select[T], *, offset: int, limit: int) -> Select[T]:
        return statement.offset(offset).limit(limit)


ResumeRepositoryDepends = Annotated[ResumeRepository, Depends(ResumeRepository)]
