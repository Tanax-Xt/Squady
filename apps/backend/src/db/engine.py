from typing import Final

from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from src.settings import settings

ENGINE: Final[AsyncEngine] = create_async_engine(
    str(settings.postgres.uri),
    pool_size=settings.postgres.pool_size,
    max_overflow=settings.postgres.max_overflow,
)
