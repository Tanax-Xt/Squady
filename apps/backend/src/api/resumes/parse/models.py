import uuid

from clickhouse_sqlalchemy import engines, types  # type: ignore
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from src.clickhouse import ChBase, TableNameMixin


# TODO: add to grafana
class ResumeParseLog(ChBase, TableNameMixin):  # type: ignore
    id: Mapped[types.String] = mapped_column(types.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[types.String] = mapped_column(types.String, nullable=False)
    source: Mapped[types.String] = mapped_column(types.String, nullable=False)
    status: Mapped[types.String] = mapped_column(types.String, nullable=False)
    created_at: Mapped[types.DateTime] = mapped_column(types.DateTime, nullable=False, default=func.now())

    __table_args__ = (engines.MergeTree(order_by=["id"]),)
