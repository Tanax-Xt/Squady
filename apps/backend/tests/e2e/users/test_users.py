import random
from typing import Any

import pytest
from fastapi import status

from src.api.users.models import User
from src.api.users.schemas import UserResponse, UsersPaginationResponse
from tests.utils.auth import AuthClient
from tests.utils.operators import icontains
from tests.utils.users import UserClient, generate_user, generate_username


@pytest.mark.anyio
class TestUsers:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, auth_client: AuthClient, user_client: UserClient) -> None:
        self.auth_client = auth_client
        self.user_client = user_client

    async def test_get_user_ok(self, user: User) -> None:
        response = await self.user_client.get_user(user.username)
        assert response.status_code == status.HTTP_200_OK

        user_response = UserResponse(**response.json())
        assert user_response.id == user.id
        assert user_response.username == user.username
        assert user_response.updated_at == user.updated_at
        assert user_response.created_at == user.created_at

    async def test_get_user_not_found(self) -> None:
        response = await self.user_client.get_user(generate_username())
        assert response.status_code == status.HTTP_404_NOT_FOUND

    async def test_get_user_unprocessable_entity(self) -> None:
        response = await self.user_client.get_user("user@example.com")
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    async def test_get_users_ok(self) -> None:
        users = [generate_user() for _ in range(3)]

        for user in users:
            await self.auth_client.register(username=user.username, password=user.password, email=user.email)

        response = await self.user_client.get_users()
        assert response.status_code == status.HTTP_200_OK

        response_users = UsersPaginationResponse(**response.json()).users
        response_usernames = {user.username for user in response_users}
        expected_usernames = {user.username for user in users}
        assert response_usernames.issubset(expected_usernames)

    async def test_get_users_not_found(self) -> None:
        response = await self.user_client.get_users()
        assert response.status_code == status.HTTP_404_NOT_FOUND

    async def test_get_users_params_q_ok(self) -> None:
        users = [generate_user() for _ in range(5)]
        random_user = random.choice(users)

        for user in users:
            await self.auth_client.register(username=user.username, password=user.password, email=user.email)

        response = await self.user_client.get_users(params=dict(q=random_user.username))
        assert response.status_code == status.HTTP_200_OK

        response_users = UsersPaginationResponse(**response.json()).users
        response_usernames = {user.username for user in response_users}
        filtered_users = [user for user in users if icontains(user.username, random_user.username)]
        expected_usernames = {user.username for user in filtered_users}
        assert response_usernames.issubset(expected_usernames)

    @pytest.mark.parametrize(
        ("params", "expected_slice"),
        [
            (dict(limit=5), slice(None, 5)),
            (dict(offset=5), slice(5, None)),
            (dict(limit=2, offset=5), slice(5, 7)),
        ],
    )
    async def test_get_users_params_limit_offset_ok(self, params: dict[str, Any], expected_slice: slice) -> None:
        users = [generate_user(username=f"user{i}") for i in range(10)]

        for user in users:
            await self.auth_client.register(username=user.username, password=user.password, email=user.email)

        response = await self.user_client.get_users(params=params)
        assert response.status_code == status.HTTP_200_OK

        response_users = UsersPaginationResponse(**response.json()).users
        response_usernames = {user.username for user in response_users}
        expected_users = users[expected_slice]
        expected_usernames = {user.username for user in expected_users}
        assert response_usernames.issubset(expected_usernames)

    async def test_get_users_params_q_limit_offset_ok(self) -> None:
        users = [generate_user(username=f"user{i}") for i in range(3)]
        random_user = random.choice(users)

        for user in users:
            await self.auth_client.register(username=user.username, password=user.password, email=user.email)

        limit = 2
        offset = 0
        params = dict(q=random_user.username, limit=str(limit), offset=str(offset))
        response = await self.user_client.get_users(params=params)
        assert response.status_code == status.HTTP_200_OK

        response_users = UsersPaginationResponse(**response.json()).users
        response_usernames = {user.username for user in response_users}
        filtered_users = [user for user in users if icontains(user.username, random_user.username)]
        expected_users = filtered_users[:limit]
        expected_usernames = {user.username for user in expected_users}
        assert response_usernames.issubset(expected_usernames)
