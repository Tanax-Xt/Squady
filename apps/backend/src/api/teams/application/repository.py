from datetime import date, datetime, time, timedelta
from typing import Annotated, Any, Sequence
from uuid import UUID

from fastapi import Depends
from sqlalchemy import Row, Select, case, func, select
from sqlalchemy.orm import selectinload

from src.api.resumes.models import Resume
from src.api.teams.application.enum import ApplicationStatusEnum
from src.api.teams.application.models import ApplicationToTeam
from src.api.teams.application.queries import ApplicationQueryParams
from src.api.teams.application.schemas import ApplicationMetricsItem, ApplicationMetricsResponse
from src.api.users.models import User
from src.db import SessionDepends
from src.pagination import PaginationSearchParams


class ApplicationToTeamRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    async def create(self, application: ApplicationToTeam) -> None:
        self.session.add(application)
        await self.session.commit()

    async def update(self, application: ApplicationToTeam) -> None:
        await self.session.commit()
        await self.session.refresh(application)

    async def get_all_by_team_id(
        self, team_id: str | UUID, search_params: PaginationSearchParams | None = None
    ) -> Sequence[Row[tuple[ApplicationToTeam, User, Resume]]]:
        search_params = search_params or PaginationSearchParams.model_construct()
        stmt = (
            select(ApplicationToTeam, User, Resume)
            .select_from(ApplicationToTeam)
            .outerjoin(User, User.id == ApplicationToTeam.user_id)
            .outerjoin(Resume, Resume.id == ApplicationToTeam.resume_id)
            .options(selectinload(Resume.role), selectinload(Resume.skills))
            .where(ApplicationToTeam.team_id == team_id)
        )

        stmt = self._paginate(stmt, offset=search_params.offset, limit=search_params.limit)

        result = await self.session.execute(stmt)
        rows = result.all()

        return rows

    async def get_by_id(self, application_id: str | UUID) -> ApplicationToTeam | None:
        stmt = select(ApplicationToTeam).where(ApplicationToTeam.id == application_id)
        result = await self.session.execute(stmt)
        return result.scalars().one_or_none()

    async def is_user_already_applied(self, user_id: str | UUID, resume_id: str | UUID, team_id: str | UUID) -> bool:
        stmt = select(ApplicationToTeam).where(
            ApplicationToTeam.user_id == user_id,
            ApplicationToTeam.resume_id == resume_id,
            ApplicationToTeam.team_id == team_id,
            ApplicationToTeam.status == ApplicationStatusEnum.sent,
        )
        result = await self.session.execute(stmt)
        return bool(result.scalars().one_or_none())

    async def get_metrics(
        self, team_id: str | UUID, params: ApplicationQueryParams | None = None
    ) -> ApplicationMetricsResponse:
        params = params or ApplicationQueryParams.model_construct()

        date_col = func.date(ApplicationToTeam.updated_at).label("date")

        sent_sum = func.sum(case((ApplicationToTeam.status == ApplicationStatusEnum.sent, 1), else_=0)).label("sent")
        accepted_sum = func.sum(case((ApplicationToTeam.status == ApplicationStatusEnum.accepted, 1), else_=0)).label(
            "accepted"
        )
        rejected_sum = func.sum(case((ApplicationToTeam.status == ApplicationStatusEnum.rejected, 1), else_=0)).label(
            "rejected"
        )
        total_count = func.count().label("total")

        stmt = (
            select(date_col, sent_sum, accepted_sum, rejected_sum, total_count)
            .select_from(ApplicationToTeam)
            .where(ApplicationToTeam.team_id == team_id)
        )

        if params.status:
            stmt = stmt.where(ApplicationToTeam.status.in_(params.status))

        if params.start_date is not None:
            dt_start = datetime.combine(params.start_date, time.min)
            stmt = stmt.where(ApplicationToTeam.updated_at >= dt_start)
        if params.end_date is not None:
            dt_end_exclusive = datetime.combine(params.end_date + timedelta(days=1), time.min)
            stmt = stmt.where(ApplicationToTeam.updated_at < dt_end_exclusive)

        stmt = stmt.group_by(date_col).order_by(date_col)

        result = await self.session.execute(stmt)
        rows = result.all()

        per_date: dict[date, dict[str, int]] = {}
        dates_list: list[date] = []
        for r in rows:
            d = r.date
            sent = int(r.sent or 0)
            accepted = int(r.accepted or 0)
            rejected = int(r.rejected or 0)
            total = int(r.total or 0)
            per_date[d] = {"sent": sent, "accepted": accepted, "rejected": rejected, "total": total}
            dates_list.append(d)

        items: list[ApplicationMetricsItem] = []
        sum_sent = sum_accepted = sum_rejected = sum_total = 0

        if params.start_date is not None and params.end_date is not None:
            start_date = params.start_date
            end_date = params.end_date
            num_days = (end_date - start_date).days + 1
            for i in range(num_days):
                d = start_date + timedelta(days=i)
                counts = per_date.get(d, {"sent": 0, "accepted": 0, "rejected": 0, "total": 0})
                items.append(
                    ApplicationMetricsItem(
                        date=d,
                        sent=counts["sent"],
                        accepted=counts["accepted"],
                        rejected=counts["rejected"],
                        total=counts["total"],
                    )
                )
                sum_sent += counts["sent"]
                sum_accepted += counts["accepted"]
                sum_rejected += counts["rejected"]
                sum_total += counts["total"]
        else:
            if dates_list:
                start_date = params.start_date or min(dates_list)
                end_date = params.end_date or max(dates_list)
                for d in sorted(dates_list):
                    counts = per_date[d]
                    items.append(
                        ApplicationMetricsItem(
                            date=d,
                            sent=counts["sent"],
                            accepted=counts["accepted"],
                            rejected=counts["rejected"],
                            total=counts["total"],
                        )
                    )
                    sum_sent += counts["sent"]
                    sum_accepted += counts["accepted"]
                    sum_rejected += counts["rejected"]
                    sum_total += counts["total"]
            else:
                today = date.today()
                start_date = today
                end_date = today
                items = []
                sum_sent = sum_accepted = sum_rejected = sum_total = 0

        response = ApplicationMetricsResponse(
            team_id=team_id,  # type: ignore
            start_date=start_date,
            end_date=end_date,
            metrics=items,
            sent=sum_sent,
            accepted=sum_accepted,
            rejected=sum_rejected,
            total=sum_total,
        )

        return response

    def _paginate[T: Any](self, statement: Select[T], *, offset: int, limit: int) -> Select[T]:
        return statement.offset(offset).limit(limit)


ApplicationToTeamRepositoryDepends = Annotated[ApplicationToTeamRepository, Depends(ApplicationToTeamRepository)]
