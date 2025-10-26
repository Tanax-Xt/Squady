import pytest
from fastapi import status

from tests.utils.auth import AuthClient
from tests.utils.auth.args import AuthLoginDict
from tests.utils.users import generate_password, generate_username
from tests.utils.users.generator import generate_email


@pytest.mark.anyio
class TestAuthLogin:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, auth_client: AuthClient) -> None:
        self.auth_client = auth_client

    async def test_login_ok(self) -> None:
        data = dict(username=generate_username(), password=generate_password(), email=generate_email())

        response = await self.auth_client.register(**data)
        assert response.status_code == status.HTTP_201_CREATED

        response = await self.auth_client.login(**data)
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize(
        ("data", "status_code"),
        (
            ({}, status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(password=generate_password()), status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(username=generate_username()), status.HTTP_422_UNPROCESSABLE_ENTITY),
            (dict(username=generate_username(), password=generate_password()), status.HTTP_401_UNAUTHORIZED),
        ),
    )
    async def test_auth_login_unprocessable_entity_unauthorized(self, data: AuthLoginDict, status_code: int) -> None:
        response = await self.auth_client.login(**data)
        assert response.status_code == status_code
