from typing import Sequence

from fastapi import APIRouter, HTTPException, status

from src.api.events.models import Event
from src.api.events.queries import EventQueryParamsDepends
from src.api.events.schemas import EventCreateRequest, EventResponse
from src.api.events.service import EventServiceDepends
from src.api.fields import EntityId
from src.api.tags import Tag
from src.api.users.me.deps import (
    CurrentUserVerifiedAgentDepends,
    CurrentUserVerifiedDepends,
)
from src.pagination import PaginationSearchParamsDepends

router = APIRouter(prefix="/events", tags=[Tag.EVENTS])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=EventResponse,
)
async def create_event(
    args: EventCreateRequest,
    service: EventServiceDepends,
    user: CurrentUserVerifiedAgentDepends,
) -> Event:
    return await service.create_team(args, user)


@router.get(
    "",
    response_model=list[EventResponse],
)
async def get_events(
    search_params: PaginationSearchParamsDepends,
    query_params: EventQueryParamsDepends,
    service: EventServiceDepends,
    user: CurrentUserVerifiedDepends,
) -> Sequence[Event]:
    return await service.get_events(search_params, query_params)


@router.get(
    "/{event_id}",
    response_model=EventResponse,
    responses={
        status.HTTP_404_NOT_FOUND: dict(
            description="Event not found",
        )
    },
)
async def get_event(
    event_id: EntityId,
    service: EventServiceDepends,
    user: CurrentUserVerifiedDepends,
) -> Event:
    event = await service.get_event_by_id(event_id)

    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    return event


@router.put(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Сannot edit a event that does not belong to the current user",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Event not found",
        ),
    },
)
async def update_event(
    event_id: EntityId,
    args: EventCreateRequest,
    service: EventServiceDepends,
    user: CurrentUserVerifiedAgentDepends,
) -> None:
    event = await service.get_event_by_id(event_id)
    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if event.agent_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Сannot edit a event that does not belong to the current user",
        )

    await service.update_event(event, args)


@router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Сannot delete a event that does not belong to the current user",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Event not found",
        ),
    },
)
async def delete_event(
    event_id: EntityId,
    service: EventServiceDepends,
    user: CurrentUserVerifiedAgentDepends,
) -> None:
    event = await service.get_event_by_id(event_id)
    if event is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if event.agent_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Сannot delete a event that does not belong to the current user",
        )

    await service.delete_event(event)
