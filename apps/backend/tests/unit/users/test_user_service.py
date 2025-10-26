from uuid import uuid4

import pytest

from src.api.users.models import User
from src.api.users.repository import UserRepository
from src.api.users.schemas import UserRegistrationRequest
from src.api.users.service import UserService
from tests.utils.users.generator import generate_email, generate_password, generate_user, generate_username


@pytest.mark.anyio
class TestUserService:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, user_service: UserService) -> None:
        self.user_service = user_service

    async def test_create_user(self) -> None:
        args = UserRegistrationRequest(
            username=generate_username(),
            password=generate_password(),
            email=generate_email(),
        )

        user = await self.user_service.create_user(args)

        assert user.id is not None
        assert user.created_at is not None
        assert user.updated_at is not None
        assert user.username == args.username
        assert user.password != args.password  # Ensure the password is hashed

    async def test_get_user_by_id_existing(self, user: User) -> None:
        result = await self.user_service.get_user_by_id(user.id)

        assert result == user

    async def test_get_user_by_id_non_existing(self) -> None:
        result = await self.user_service.get_user_by_id(uuid4())

        assert result is None

    async def test_get_user_by_username_existing(self, user: User) -> None:
        result = await self.user_service.get_user_by_username(user.username)

        assert result == user

    async def test_get_user_by_username_non_existing(self) -> None:
        result = await self.user_service.get_user_by_username(generate_username())

        assert result is None

    async def test_get_users_empty(self) -> None:
        users = await self.user_service.get_users()

        assert len(users) == 0

    async def test_get_users_with_users(self, user_repository: UserRepository) -> None:
        count = 3

        for _ in range(count):
            await user_repository.create(generate_user())

        users = await self.user_service.get_users()

        assert len(users) == count
