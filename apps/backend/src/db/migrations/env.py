import os

from alembic import context
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", ".."))

dotenv_path = os.path.join(BASE_DIR, ".env")

load_dotenv(dotenv_path)

from src.db import Base  # noqa: E402
from src.settings import settings  # noqa: E402


def run_migrations_offline() -> None:
    context.configure(url=str(settings.postgres.uri), target_metadata=Base.metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    engine = create_async_engine(str(settings.postgres.uri))

    async with engine.begin() as connection:
        await connection.run_sync(
            lambda sync_connection: context.configure(
                connection=sync_connection,
                target_metadata=Base.metadata,
                compare_type=True,
            )
        )

        await connection.run_sync(lambda _: context.run_migrations())

    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio

    asyncio.run(run_migrations_online())
