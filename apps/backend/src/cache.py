__all__ = [
    "RedisDepends",
]

from typing import Annotated, Any

from fastapi import Depends
from redis.asyncio import Redis

from src.settings import settings

redis: Redis = Redis(host=settings.redis.host, port=settings.redis.port)


async def get_redis() -> Redis:
    return redis


def separate(*args: Any) -> str:
    return settings.redis.separator.join(args)


RedisDepends = Annotated[Redis, Depends(get_redis)]
