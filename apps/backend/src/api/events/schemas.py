from datetime import date
from typing import Self

from pydantic import model_validator

from src.api.events.enum import EventType
from src.api.events.fields import EventDescription, EventItem
from src.api.fields import EntityId
from src.api.schemas import AuditBaseModel, BaseSchema


class EventCreateRequest(BaseSchema):
    title: EventItem
    description: EventDescription
    start_date: date
    end_date: date
    location: EventItem
    format: EventType

    @model_validator(mode="after")
    def check_dates(self) -> Self:
        if self.end_date < self.start_date:
            raise ValueError("start_date cannot be after end_date")
        return self


class EventResponse(AuditBaseModel):
    id: EntityId
    agent_id: EntityId
    title: EventItem
    description: str
    start_date: date
    end_date: date
    location: EventItem
    format: EventType
