import asyncio
from typing import Annotated, AsyncIterator

from fastapi import Depends
from sqlalchemy.orm import Session

from src.clickhouse.session import CH_SessionLocal


async def ch_get_session() -> AsyncIterator[Session]:
    loop = asyncio.get_event_loop()
    session = CH_SessionLocal
    try:
        yield session
    finally:
        await loop.run_in_executor(None, session.close)


ChSessionDepends = Annotated[Session, Depends(ch_get_session)]
