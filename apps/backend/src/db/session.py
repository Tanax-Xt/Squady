from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from src.db.engine import ENGINE

SessionLocal = async_sessionmaker(
    bind=ENGINE,
    expire_on_commit=False,
    class_=AsyncSession,
)
