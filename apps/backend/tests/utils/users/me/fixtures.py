import pytest
from httpx import AsyncClient

from src.api.users.me.service import CurrentUserService
from src.api.users.repository import UserRepository
from tests.utils.users.me.client import CurrentUserClient


@pytest.fixture(scope="function")
async def current_user_client(client: AsyncClient) -> CurrentUserClient:
    return CurrentUserClient(client=client)


@pytest.fixture(scope="function")
async def current_user_service(user_repository: UserRepository) -> CurrentUserService:
    return CurrentUserService(repository=user_repository)
