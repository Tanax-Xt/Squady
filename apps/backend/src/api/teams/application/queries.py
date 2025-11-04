from datetime import date
from typing import Annotated, Self

from fastapi import Depends, Query
from pydantic import model_validator

from src.api.schemas import BaseSchema
from src.api.teams.application.enum import ApplicationStatusEnum

ApplicationQueryStatusList = Annotated[
    list[ApplicationStatusEnum] | None,
    Query(
        title="Application statuses",
        description="Application statuses",
        examples=[[ApplicationStatusEnum.sent, ApplicationStatusEnum.accepted]],
    ),
]

ApplicationQueryDate = Annotated[
    date | None,
    Query(
        title="Application date",
        description="Application date",
    ),
]


class ApplicationQueryParams(BaseSchema):
    start_date: ApplicationQueryDate = None
    end_date: ApplicationQueryDate = None
    status: ApplicationQueryStatusList = None

    @model_validator(mode="after")
    def check_years(self) -> Self:
        if self.start_date is not None and self.end_date is not None and self.start_date > self.end_date:
            raise ValueError("Start_date cannot be after end_date")
        return self


def get_application_query_params(
    start_date: ApplicationQueryDate = None,
    end_date: ApplicationQueryDate = None,
    status: ApplicationQueryStatusList = None,
) -> ApplicationQueryParams:
    return ApplicationQueryParams(
        start_date=start_date,
        end_date=end_date,
        status=status,
    )


ApplicationQueryParamsDepends = Annotated[ApplicationQueryParams, Depends(get_application_query_params)]
