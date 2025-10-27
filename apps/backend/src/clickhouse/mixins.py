from typing import Any

from sqlalchemy.orm import declared_attr
from textcase import snake


class TableNameMixin:
    @declared_attr
    @classmethod
    def __tablename__(cls) -> Any:
        return snake(cls.__name__)
