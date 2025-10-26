from typer import colors, secho

from src.api.users.enums import UserRole
from src.api.users.models import User
from src.api.users.repository import UserRepository
from src.db import get_session
from src.security import get_password_hash

usernames = [
    "tanax",
    "zobweyt",
]


async def populate_users() -> None:
    async for session in get_session():
        user_repository = UserRepository(session=session)

        for username in usernames:
            email = f"{username}@example.com"

            if await user_repository.get_by_username(username):
                return secho(f"Пользователь с именем '{username}' уже существует.", fg=colors.RED)

            if await user_repository.get_by_email(email):
                return secho(f"Пользователь с электронной почтой '{email}' уже существует.", fg=colors.RED)

            user = User(
                username=username,
                email=email,
                password=await get_password_hash("password"),
                role=UserRole.participant,
                is_verified=True,
            )

            try:
                await user_repository.create(user)

                secho(f"Пользователь с именем '{username}' успешно создан.", fg=colors.GREEN)
            except Exception as exception:
                secho(f"Не удалось создать пользователя с именем '{username}':\n\n{exception}", fg=colors.RED)
