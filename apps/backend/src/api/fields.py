from typing import Annotated

from pydantic import UUID4, Field

EntityId = Annotated[
    UUID4,
    Field(
        title="Entity ID",
        description="Unique identifier for the entity in UUID4 format.",
        examples=["780de52b-b406-4764-ba9f-5c1e81b9f90f"],
    ),
]
