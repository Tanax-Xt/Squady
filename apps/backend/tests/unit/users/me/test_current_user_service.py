import pytest

from src.api.users.me.service import CurrentUserService
from src.api.users.models import User
from src.api.users.service import UserService
from tests.utils.users import generate_password, generate_username


@pytest.mark.anyio
class TestCurrentUserService:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, user_service: UserService, current_user_service: CurrentUserService) -> None:
        self.user_service = user_service
        self.current_user_service = current_user_service

    async def test_update_username(self, user: User) -> None:
        old_username = user.username
        new_username = generate_username()

        await self.current_user_service.update_username(user, new_username)

        refreshed_user = await self.user_service.get_user_by_id(user.id)

        assert refreshed_user is not None
        assert refreshed_user.username != old_username
        assert refreshed_user.username == new_username

    async def test_update_password(self, user: User) -> None:
        old_password = user.password
        new_password = generate_password()

        await self.current_user_service.update_password(user, new_password)

        refreshed_user = await self.user_service.get_user_by_id(user.id)

        assert refreshed_user is not None
        assert refreshed_user.password != old_password
        assert refreshed_user.password != new_password  # Ensure the password is hashed
