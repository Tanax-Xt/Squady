__all__ = [
    "RedisSettings",
]

from pydantic import BaseModel


class RedisSettings(BaseModel):
    port: int
    host: str
    separator: str = ":"
