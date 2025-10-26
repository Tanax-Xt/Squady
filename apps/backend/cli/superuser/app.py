__all__ = [
    "app",
]

import asyncio

from typer import Option, Typer

from cli.superuser.service import create_superuser

app = Typer(
    name="superuser",
    help="Управление супер-пользователями.",
)


@app.command(
    help="Создание нового супер-пользователя",
)
def create(
    username: str = Option(
        None,
        "--username",
        "-u",
        prompt="Введите имя нового супер-пользователя",
        help="Имя нового супер-пользователя (английскими буквами без пробелов).",
    ),
    email: str = Option(
        None,
        "--email",
        "-e",
        prompt="Введите электронную почту нового супер-пользователя",
        help="Электронная почта нового супер-пользователя.",
    ),
    password: str = Option(
        None,
        "--password",
        "-p",
        prompt="Введите пароль нового супер-пользователя",
        confirmation_prompt=True,
        hide_input=True,
        help="Пароль нового супер-пользователя.",
    ),
) -> None:
    asyncio.run(create_superuser(username, email, password))
