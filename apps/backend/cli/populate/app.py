__all__ = [
    "app",
]

import asyncio

from typer import Typer

from cli.populate.service import populate_resumes, populate_roles, populate_skills, populate_users

app = Typer(
    name="populate",
    help="Наполнение базы данных тестовыми данными.",
)


@app.command(
    help="Создаёт тестовых пользователей с паролем 'password'.",
)
def users() -> None:
    asyncio.run(populate_users())


@app.command(
    help="Создаёт роли для резюме.",
)
def roles() -> None:
    asyncio.run(populate_roles())


@app.command(
    help="Создаёт навыки для резюме.",
)
def skills() -> None:
    asyncio.run(populate_skills())


@app.command(
    help="Создаёт резюме для тестовых пользователей.",
)
def resumes() -> None:
    asyncio.run(populate_resumes())
