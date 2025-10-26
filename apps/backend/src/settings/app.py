__all__ = [
    "AppSettings",
]

from pydantic import BaseModel


class AppSettings(BaseModel):
    debug: bool = True
    title: str
    summary: str
    description: str
    version: str
    openapi_url: str | None
    docs_url: str | None
    redoc_url: str | None
    root_path: str
