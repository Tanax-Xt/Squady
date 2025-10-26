__all__ = [
    "app",
]

import asyncio

from typer import Typer

from cli.populate.service import populate_users

app = Typer(
    name="populate",
    help="Наполнение базы данных тестовыми данными.",
)


@app.command(
    help="Создаёт тестовых пользователей с паролем 'password'.",
)
def users() -> None:
    asyncio.run(populate_users())
