__all__ = [
    "CORSSettings",
]

from typing import Sequence

from pydantic import BaseModel


class CORSSettings(BaseModel):
    allow_credentials: bool
    allow_headers: Sequence[str]
    allow_methods: Sequence[str]
    allow_origins: Sequence[str]
