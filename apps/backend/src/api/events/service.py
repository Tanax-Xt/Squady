from typing import Annotated, Sequence
from uuid import UUID

from fastapi import Depends

from src.api.events.models import Event
from src.api.events.queries import EventQueryParams
from src.api.events.repository import EventRepositoryDepends
from src.api.events.schemas import EventCreateRequest
from src.api.users.models import User
from src.pagination import PaginationSearchParams


class EventService:
    def __init__(self, repository: EventRepositoryDepends) -> None:
        self.repository = repository

    async def create_team(self, args: EventCreateRequest, agent: User) -> Event:
        team = Event(
            agent_id=agent.id,
            title=args.title,
            description=args.description,
            start_date=args.start_date,
            end_date=args.end_date,
            location=args.location,
            format=args.format,
        )

        return await self.repository.create(team)

    async def get_event_by_id(self, event_id: UUID | str) -> Event | None:
        return await self.repository.get_by_id(event_id)

    async def update_event(self, event: Event, args: EventCreateRequest) -> None:
        data_to_update = args.model_dump()
        event.update(data_to_update)
        await self.repository.update(event)

    async def delete_event(self, event: Event) -> None:
        await self.repository.delete(event)

    async def get_events(
        self, search_params: PaginationSearchParams | None = None, query_params: EventQueryParams | None = None
    ) -> Sequence[Event]:
        return await self.repository.get_all_with_params(search_params, query_params)


EventServiceDepends = Annotated[EventService, Depends(EventService)]
