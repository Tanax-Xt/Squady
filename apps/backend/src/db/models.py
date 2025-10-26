from typing import Any

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
