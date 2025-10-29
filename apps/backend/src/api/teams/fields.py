from typing import Annotated

from pydantic import Field, StringConstraints

from src.settings import settings

TeamTitle = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.team_title_max_length,
    ),
    Field(title="Title", description="Team title", examples=["Title"]),
]

TeamTextField = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.team_text_field_max_length,
    ),
    Field(
        title="Text field",
        description="Team text field",
        examples=["We are a team of developers."],
    ),
]
