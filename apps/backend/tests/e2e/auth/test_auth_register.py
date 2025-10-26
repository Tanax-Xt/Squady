import pytest
from fastapi import status

from tests.utils.auth.args import AuthRegisterDict
from tests.utils.auth.client import AuthClient
from tests.utils.users import generate_password, generate_username
from tests.utils.users.generator import generate_email


@pytest.mark.anyio
class TestAuthRegister:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, auth_client: AuthClient) -> None:
        self.auth_client = auth_client

    async def test_register_created(self) -> None:
        response = await self.auth_client.register(
            username=generate_username(), password=generate_password(), email=generate_email()
        )
        assert response.status_code == status.HTTP_201_CREATED

    async def test_register_conflict(self) -> None:
        json = dict(username=generate_username(), password=generate_password(), email=generate_email())

        response = await self.auth_client.register(**json)
        assert response.status_code == status.HTTP_201_CREATED

        response = await self.auth_client.register(**json)
        assert response.status_code == status.HTTP_409_CONFLICT

    @pytest.mark.parametrize(
        ("json", "status_code"),
        (
            ({}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(password=generate_password()), status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(username=generate_username()), status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(username=generate_username(), password="short"), status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(username="@@", password=generate_password()), status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(username="user@example.com", password="short"), status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(email=generate_email(), password="short"), status.HTTP_422_UNPROCESSABLE_ENTITY),
        ),
    )
    async def test_register_unprocessable_entity(self, json: AuthRegisterDict, status_code: int) -> None:
        response = await self.auth_client.register(**json)
        assert response.status_code == status_code
