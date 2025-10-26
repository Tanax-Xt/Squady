from typing import Annotated

from fastapi import Depends

from src.api.users.enums import UserRole
from src.api.users.me.personal.schemas import CurrentUserPersonalDataRequest, CurrentUserPersonalDataUpdateRequest
from src.api.users.models import User
from src.api.users.repository import UserRepositoryDepends
from src.security import get_password_hash


class CurrentUserService:
    def __init__(self, repository: UserRepositoryDepends) -> None:
        self.repository = repository

    async def update_username(self, user: User, new_username: str) -> None:
        user.username = new_username

        await self.repository.update(user)

    async def update_password(self, user: User, new_password: str) -> None:
        user.password = await get_password_hash(password=new_password)

        await self.repository.update(user)

    async def update_role(self, user: User, role: UserRole) -> None:
        user.role = role

        if role == UserRole.agent:
            user.is_verified_agent = False

        await self.repository.update(user)

    async def update_user_personal_data(
        self, user: User, personal_data: CurrentUserPersonalDataRequest | CurrentUserPersonalDataUpdateRequest
    ) -> None:
        data = personal_data.model_dump(exclude_unset=True)

        user.update(data)

        await self.repository.update(user)

    async def verify_user(self, user: User) -> None:
        user.is_verified = True

        await self.repository.update(user)


CurrentUserServiceDepends = Annotated[CurrentUserService, Depends(CurrentUserService)]
