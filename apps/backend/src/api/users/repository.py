from typing import Annotated, Any, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Select, func, select

from src.api.users.models import User
from src.db import SessionDepends
from src.pagination import PaginationSearchParams


class UserRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    async def create(self, user: User) -> User:
        self.session.add(user)

        await self.session.commit()
        await self.session.refresh(user)

        return user

    async def update(self, user: User) -> None:
        await self.session.commit()
        await self.session.refresh(user)

    async def get_by_id(self, id: str | UUID) -> User | None:
        statement = select(User).where(User.id == id)
        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> User | None:
        statement = select(User).where(User.username == username)
        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def get_all(self, search_params: PaginationSearchParams | None = None) -> Sequence[User]:
        search_params = search_params or PaginationSearchParams.model_construct()

        statement = select(User)
        statement = self._filter(statement, q=search_params.q)
        statement = self._paginate(statement, offset=search_params.offset, limit=search_params.limit)

        result = await self.session.execute(statement)

        return result.scalars().all()

    async def get_count(self, search_params: PaginationSearchParams | None = None) -> int:
        search_params = search_params or PaginationSearchParams.model_construct()

        statement = select(func.count()).select_from(User)
        statement = self._filter(statement, q=search_params.q)

        result = await self.session.scalar(statement)

        return result if result is not None else 0

    def _filter[T: Any](self, statement: Select[T], *, q: str | None = None) -> Select[T]:
        return statement.filter(User.username.icontains(q)) if q else statement

    def _paginate[T: Any](self, statement: Select[T], *, offset: int, limit: int) -> Select[T]:
        return statement.order_by(User.username).offset(offset).limit(limit)


UserRepositoryDepends = Annotated[UserRepository, Depends(UserRepository)]
