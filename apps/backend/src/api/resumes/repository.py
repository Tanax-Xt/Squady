from typing import Annotated, Any, Sequence, cast
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Select, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError

from src.api.resumes.models import Resume, Role, Skill
from src.db import SessionDepends
from src.pagination import PaginationSearchParams


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

    async def create_and_get_skills_by_names(self, names: list[str]) -> Sequence[Skill]:
        stmt = insert(Skill).values([{"name": name} for name in names])
        stmt = stmt.on_conflict_do_nothing(index_elements=[func.lower(Skill.name)])
        await self.session.execute(stmt)
        await self.session.commit()

        statement = select(Skill).where(func.lower(Skill.name).in_([name.lower() for name in names]))
        result = await self.session.execute(statement)
        existing: Sequence[Skill] = result.scalars().all()

        return existing

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

    def _filter[T: Any](self, statement: Select[T], *, q: str | None = None) -> Select[T]:
        if not q:
            return statement

        statement = statement.join(Resume.role)

        return statement.filter(Role.name.icontains(q))

    def _paginate[T: Any](self, statement: Select[T], *, offset: int, limit: int) -> Select[T]:
        return statement.offset(offset).limit(limit)


ResumeRepositoryDepends = Annotated[ResumeRepository, Depends(ResumeRepository)]
