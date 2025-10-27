from typing import Any

from sqlalchemy import Connection
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase
from textcase import snake

from src.db.mixins import AttributeUpdaterMixin, ReprMixin


class Base(DeclarativeBase, AttributeUpdaterMixin, ReprMixin):
    """Base class for SQLAlchemy models."""

    @declared_attr
    @classmethod
    def __tablename__(cls) -> Any:
        return snake(cls.__name__)

    @classmethod
    def create_all_skip_indexes(cls, bind: Connection) -> None:
        skipped = []

        for table in cls.metadata.tables.values():
            to_remove = [idx for idx in table.indexes if idx.info.get("skip_for_create_all")]
            for idx in to_remove:
                table.indexes.remove(idx)
            skipped.extend(to_remove)

        cls.metadata.create_all(bind=bind)

        for idx in skipped:
            if idx.table is not None:
                idx.table.indexes.add(idx)
