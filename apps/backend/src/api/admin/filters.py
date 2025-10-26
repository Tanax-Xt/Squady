__all__ = [
    "ALL",
    "NONE",
    "NullableStaticValuesFilter",
]


from typing import Any, Callable

from sqladmin.filters import StaticValuesFilter, get_column_obj, get_parameter_name, get_title
from sqlalchemy import Select
from sqlalchemy.orm import InstrumentedAttribute
from starlette.requests import Request

ALL = ""
NONE = "none"


class NullableStaticValuesFilter[T: tuple[Any, ...]](StaticValuesFilter):
    def __init__(
        self,
        column: str | InstrumentedAttribute[Any],
        values: list[tuple[str, str]],
        title: str | None = None,
        parameter_name: str | None = None,
    ):
        self.column = column
        self.title = title or get_title(column)
        self.parameter_name = parameter_name or get_parameter_name(column)
        self.values = values

    async def lookups(
        self, request: Request, model: Any, run_query: Callable[[Select[T]], Any]
    ) -> list[tuple[str, str]]:
        return [(ALL, "All")] + self.values + [(NONE, "None")]

    async def get_filtered_query(self, query: Select[T], value: Any, model: Any) -> Select[T]:
        column_obj = get_column_obj(self.column, model)
        if value == ALL:
            return query
        if value == NONE:
            return query.filter(column_obj.is_(None))
        return query.filter(column_obj == value)
