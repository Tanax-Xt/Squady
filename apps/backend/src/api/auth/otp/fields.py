from typing import Annotated

from pydantic import Field

from src.settings import settings

OneTimePassword = Annotated[
    int,
    Field(
        ge=int("0" * settings.otp.length),
        le=int("9" * settings.otp.length),
    ),
]
