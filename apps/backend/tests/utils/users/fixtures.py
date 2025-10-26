import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.users.models import User
from src.api.users.repository import UserRepository
from src.api.users.service import UserService
from tests.utils.users.client import UserClient
from tests.utils.users.generator import generate_user


@pytest.fixture(scope="function")
async def user_client(client: AsyncClient) -> UserClient:
    return UserClient(client=client)


@pytest.fixture(scope="function")
async def user_repository(session: AsyncSession) -> UserRepository:
    return UserRepository(session=session)


@pytest.fixture(scope="function")
async def user_service(user_repository: UserRepository) -> UserService:
    return UserService(repository=user_repository)


@pytest.fixture(scope="function")
async def user(user_repository: UserRepository) -> User:
    return await user_repository.create(generate_user())
