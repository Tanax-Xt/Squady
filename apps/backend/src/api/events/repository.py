from typing import Annotated, Any, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Select, or_, select

from src.api.events.models import Event
from src.api.events.queries import EventQueryParams
from src.db import SessionDepends
from src.pagination import PaginationSearchParams


class EventRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    async def create(self, event: Event) -> Event:
        self.session.add(event)

        await self.session.commit()
        await self.session.refresh(event)

        return event

    async def update(self, event: Event) -> None:
        await self.session.commit()
        await self.session.refresh(event)

    async def get_by_id(self, id: UUID | str) -> Event | None:
        statement = select(Event).where(Event.id == id)

        result = await self.session.execute(statement)

        return result.scalar_one_or_none()

    async def delete(self, event: Event) -> None:
        await self.session.delete(event)
        await self.session.commit()

    async def get_all_with_params(
        self, search_params: PaginationSearchParams | None = None, query_params: EventQueryParams | None = None
    ) -> Sequence[Event]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query_params = query_params or EventQueryParams.model_construct()

        statement = select(Event)
        statement = (
            statement.filter(or_(Event.location.icontains(search_params.q), Event.title.icontains(search_params.q)))
            if search_params.q
            else statement
        )

        if query_params.format is not None:
            statement = statement.where(Event.format.in_(query_params.format))

        if query_params.start_date is not None:
            statement = statement.where(Event.start_date >= query_params.start_date)

        if query_params.end_date is not None:
            statement = statement.where(Event.end_date <= query_params.end_date)

        statement = self._paginate(statement, offset=search_params.offset, limit=search_params.limit)
        result = await self.session.execute(statement)
        return result.scalars().all()

    def _paginate[T: Any](self, statement: Select[T], *, offset: int, limit: int) -> Select[T]:
        return statement.offset(offset).limit(limit)


EventRepositoryDepends = Annotated[EventRepository, Depends(EventRepository)]
