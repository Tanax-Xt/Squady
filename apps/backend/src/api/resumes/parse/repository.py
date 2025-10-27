import asyncio
from typing import Annotated

from fastapi import Depends

from src.api.resumes.parse.models import ResumeParseLog
from src.clickhouse import ChSessionDepends


class ResumeParseLogRepository:
    def __init__(self, session: ChSessionDepends) -> None:
        self.session = session

    async def create(self, log: ResumeParseLog) -> None:
        self.session.add(log)

        await asyncio.get_running_loop().run_in_executor(None, self.session.flush)


ResumeParseLogRepositoryDepends = Annotated[ResumeParseLogRepository, Depends(ResumeParseLogRepository)]
