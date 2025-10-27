import os
from datetime import date
from typing import Any

from typer import colors, secho

from src.api.resumes.enums import EducationType
from src.api.resumes.models import Resume
from src.api.resumes.repository import ResumeRepository
from src.api.users.enums import UserRole
from src.api.users.models import User
from src.api.users.repository import UserRepository
from src.db import get_session
from src.security import get_password_hash

users: list[dict[Any, Any]] = [
    dict(
        username="tanax",
        full_name="Седельников Данила",
        birth_date="2008-01-25",
        telegram="forever_molodoy",
        city="Москва",
        about="23 года, дизайнер из Санкт-Петербурга",
        role="Backend-разработчик",
        skills=["Python", "FastAPI", "PostgreSQL", "Prometheus", "Grafana", "CI/CD", "NGINX"],
        education=dict(type=EducationType.high_school, title="Лицей ВШЭ", end_year=2026),
        experience=[
            dict(
                title="Рекламушка",
                description="b2b и b2c рекламный движок",
                start_date="2025-02",
                end_date="2025-03",
                is_work=False,
                company=None,
            )
        ],
        achievements=[
            dict(title="Победитель олимпиады НТО", year=2025),
            dict(title="Призер олимпиады PROD", year=2025),
            dict(title="Призер олимпиады НТО", year=2024),
        ],
        additional_education=[
            dict(title="Летняя школа НИУ ВШЭ по Программной инженерии", start_date="2025-06", end_date="2025-06"),
        ],
    ),
    dict(
        username="zobweyt",
        full_name="Газиев Никита",
        birth_date="2008-07-27",
        telegram="zobweyt",
        city="Москва",
        about="Software developer with a passion for open-source projects.",
        role="Frontend-разработчик",
        skills=["TypeScript", "React", "Next.js", "npm", "SolidJS"],
        education=dict(type=EducationType.high_school, title='ЧОУ ОО "МШСО"', end_year=2026),
        experience=[
            dict(
                title="textcase",
                description="Python library for text case conversions (https://pypi.org/project/textcase)",
                start_date="2025-03",
                end_date="2025-05",
                is_work=False,
                company=None,
            ),
            dict(
                title="Силушка",
                description="Веб-приложения для поддержания хорошей физической формы",
                start_date="2025-02",
                end_date=None,
                is_work=False,
                company=None,
            ),
        ],
        achievements=[
            dict(title="Победитель олимпиады НТО", year=2025),
            dict(title="Призер олимпиады PROD", year=2025),
        ],
        additional_education=None,
    ),
]


async def populate_users() -> None:
    async for session in get_session():
        user_repository = UserRepository(session=session)

        for user_data in users:
            email = f"{user_data['username']}@example.com"

            if await user_repository.get_by_username(user_data["username"]):
                secho(f"Пользователь с именем '{user_data['username']}' уже существует.", fg=colors.RED)
                continue

            if await user_repository.get_by_email(email):
                secho(f"Пользователь с электронной почтой '{email}' уже существует.", fg=colors.RED)
                continue

            user = User(
                username=user_data["username"],
                email=email,
                password=await get_password_hash("password"),
                role=UserRole.participant,
                is_verified=True,
                full_name=user_data["full_name"],
                birth_date=date.fromisoformat(user_data["birth_date"]),
                telegram=user_data["telegram"],
                city=user_data["city"],
                about=user_data["about"],
            )

            try:
                await user_repository.create(user)

                secho(f"Пользователь с именем '{user_data['username']}' успешно создан.", fg=colors.GREEN)
            except Exception as exception:
                secho(
                    f"Не удалось создать пользователя с именем '{user_data['username']}':\n\n{exception}", fg=colors.RED
                )


async def populate_roles() -> None:
    roles = _parsing("data/roles.txt")

    async for session in get_session():
        resume_repository = ResumeRepository(session=session)

        try:
            await resume_repository.bulk_create_roles(roles)
            secho("Роли успешно созданы.", fg=colors.GREEN)
        except Exception as exception:
            secho(f"Не удалось создать роли:\n\n{exception}", fg=colors.RED)


async def populate_skills() -> None:
    skills = _parsing("data/skills.txt")

    async for session in get_session():
        resume_repository = ResumeRepository(session=session)

        try:
            await resume_repository.create_and_get_skills_by_names(skills)
            secho("Навыки успешно созданы.", fg=colors.GREEN)
        except Exception as exception:
            secho(f"Не удалось создать навыки:\n\n{exception}", fg=colors.RED)


async def populate_resumes() -> None:
    async for session in get_session():
        user_repository = UserRepository(session=session)
        resume_repository = ResumeRepository(session=session)

        for user_data in users:
            user = await user_repository.get_by_username(user_data["username"])

            if user is None:
                secho(f"Пользователь с именем '{user_data['username']}' не существует.", fg=colors.RED)
                continue

            if await resume_repository.get_by_user_id_and_role(user.id, user_data["role"]):
                secho(f"Пользователь '{user_data['username']}' уже имеет резюме.", fg=colors.RED)
                continue

            role = await resume_repository.create_and_get_role_by_name(user_data["role"])
            skills = await resume_repository.create_and_get_skills_by_names(user_data["skills"])

            resume = Resume(
                user_id=user.id,
                role_id=role.id,
                skills=skills,
                education=user_data["education"],
                experience=user_data["experience"],
                achievements=user_data["achievements"],
                additional_education=user_data["additional_education"],
                is_public=True,
                is_parsed=False,
            )

            try:
                await resume_repository.create(resume)

                secho(f"Резюме для пользователя '{user_data['username']}' успешно создано.", fg=colors.GREEN)
            except Exception as exception:
                secho(
                    f"Не удалось создать резюме для пользователя '{user_data['username']}':\n\n{exception}",
                    fg=colors.RED,
                )


def _parsing(path: str) -> list[str]:
    here = os.path.abspath(os.path.dirname(__file__))
    joined_path = os.path.join(here, path)

    with open(joined_path, "r", encoding="utf-8") as file:
        return [role.strip() for role in file.readlines()]
