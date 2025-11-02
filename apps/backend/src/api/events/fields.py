from typing import Annotated

from pydantic import Field, StringConstraints

from src.settings import settings

EventItem = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.event_item_max_length,
    ),
    Field(title="Item", description="Event item", examples=["Title"]),
]

EventDescription = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.event_description_max_length,
    ),
    Field(title="Description", description="Event description", examples=["Description"]),
]
