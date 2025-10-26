import pytest
from fastapi import status

from src.api.auth.schemas import AccessTokenResponse
from src.api.users.me.schemas import CurrentUserResponse
from tests.utils.auth.client import AuthClient
from tests.utils.users.generator import generate_email, generate_password, generate_username
from tests.utils.users.me.client import CurrentUserClient


@pytest.mark.anyio
class TestUsersMe:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, auth_client: AuthClient, current_user_client: CurrentUserClient) -> None:
        self.auth_client = auth_client
        self.current_user_client = current_user_client

    async def test_get_current_user_ok(self) -> None:
        username = generate_username()
        password = generate_password()
        email = generate_email()

        response = await self.auth_client.register(username=username, password=password, email=email)
        assert response.status_code == status.HTTP_201_CREATED
        token = AccessTokenResponse(**response.json()).access_token

        response = await self.current_user_client.get_current_user(token=token)
        assert response.status_code == status.HTTP_200_OK
        current_user_response = CurrentUserResponse(**response.json())
        assert current_user_response.username == username

    async def test_get_current_user_unauthorized(self) -> None:
        response = await self.current_user_client.get_current_user()
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    async def test_get_current_user_forbidden(self) -> None:
        response = await self.current_user_client.get_current_user(token="user@example.com")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    async def test_update_current_user_username(self) -> None:
        username1 = generate_username()
        password1 = generate_password()
        email1 = generate_email()

        username2 = generate_username()
        password2 = generate_password()
        email2 = generate_email()

        new_username = generate_username()

        response = await self.auth_client.register(username=username1, password=password1, email=email1)
        token = AccessTokenResponse(**response.json()).access_token
        assert response.status_code == status.HTTP_201_CREATED

        response = await self.auth_client.register(username=username2, password=password2, email=email2)
        assert response.status_code == status.HTTP_201_CREATED

        response = await self.current_user_client.update_current_user_username(username=new_username, token=token)
        assert response.status_code == status.HTTP_204_NO_CONTENT

        response = await self.current_user_client.get_current_user(token=token)
        assert response.status_code == status.HTTP_200_OK
        current_user_response = CurrentUserResponse(**response.json())
        assert current_user_response.username == new_username

        response = await self.current_user_client.update_current_user_username(username=username2, token=token)
        assert response.status_code == status.HTTP_409_CONFLICT

        response = await self.current_user_client.update_current_user_username(username="user@example.com", token=token)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    async def test_update_current_user_password(self) -> None:
        username1 = generate_username()
        password1 = generate_password()
        email1 = generate_email()

        new_password = generate_password()

        response = await self.auth_client.register(username=username1, password=password1, email=email1)
        assert response.status_code == status.HTTP_201_CREATED
        token = AccessTokenResponse(**response.json()).access_token

        response = await self.current_user_client.update_current_user_password(
            old_password=password1,
            new_password=new_password,
            token=token,
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT

        response = await self.auth_client.login(username=username1, password=password1)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        response = await self.auth_client.login(username=username1, password=new_password)
        assert response.status_code == status.HTTP_200_OK

        response = await self.current_user_client.update_current_user_password(
            old_password=password1,
            new_password=password1,
            token=token,
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

        response = await self.current_user_client.update_current_user_password(
            old_password="user@example.com",
            new_password="user@example.com",
            token=token,
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
