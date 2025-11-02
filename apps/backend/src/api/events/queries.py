from datetime import date
from typing import Annotated, Self

from fastapi import Depends, Query
from pydantic import model_validator

from src.api.events.enum import EventType
from src.api.schemas import BaseSchema

EventQueryFormatsList = Annotated[
    list[EventType] | None,
    Query(
        title="Event formats",
        description="Event formats",
        examples=[[EventType.offline, EventType.online]],
    ),
]

EventQueryDate = Annotated[
    date | None,
    Query(
        title="Event date",
        description="Event date",
    ),
]


class EventQueryParams(BaseSchema):
    start_date: EventQueryDate = None
    end_date: EventQueryDate = None
    format: EventQueryFormatsList = None

    @model_validator(mode="after")
    def check_years(self) -> Self:
        if self.start_date is not None and self.end_date is not None and self.start_date > self.end_date:
            raise ValueError("Start_date cannot be after end_date")
        return self


def get_event_query_params(
    start_date: EventQueryDate = None,
    end_date: EventQueryDate = None,
    format: EventQueryFormatsList = None,
) -> EventQueryParams:
    return EventQueryParams(
        start_date=start_date,
        end_date=end_date,
        format=format,
    )


EventQueryParamsDepends = Annotated[EventQueryParams, Depends(get_event_query_params)]
