__all__ = [
    "auth_client",
    "current_user_client",
    "current_user_service",
    "user_client",
    "user_repository",
    "user_service",
    "user",
]

import asyncio
from collections.abc import AsyncIterator, Iterator
from typing import Literal

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from src.app import app
from src.db import Base, get_session
from src.settings import settings
from tests.utils.auth import auth_client
from tests.utils.users import user, user_client, user_repository, user_service
from tests.utils.users.me import current_user_client, current_user_service


@pytest.fixture(scope="session")
def anyio_backend() -> Literal["asyncio"]:
    return "asyncio"


@pytest.fixture(scope="session")
def event_loop() -> Iterator[asyncio.AbstractEventLoop]:
    loop = asyncio.new_event_loop()

    yield loop

    loop.close()


@pytest.fixture(scope="function")
async def engine() -> AsyncIterator[AsyncEngine]:
    engine = create_async_engine(
        str(settings.postgres_test.uri),
        pool_size=settings.postgres_test.pool_size,
        max_overflow=settings.postgres_test.max_overflow,
    )

    yield engine

    await engine.dispose()


@pytest.fixture(scope="function")
async def session(engine: AsyncEngine) -> AsyncIterator[AsyncSession]:
    async with engine.connect() as connection:
        await connection.run_sync(Base.metadata.drop_all)
        await connection.run_sync(Base.metadata.create_all)

        async_session = async_sessionmaker(connection, expire_on_commit=False)

        async with async_session() as session:
            yield session


@pytest.fixture(scope="function")
async def client(session: AsyncSession) -> AsyncIterator[AsyncClient]:
    app.dependency_overrides[get_session] = lambda: session

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

    app.dependency_overrides.clear()
