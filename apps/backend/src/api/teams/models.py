import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.api.teams.enum import StatusEnum
from src.db import AuditMixin, Base

if TYPE_CHECKING:
    pass


class Team(Base, AuditMixin):
    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column()
    about: Mapped[str] = mapped_column(nullable=True)
    tasks: Mapped[str] = mapped_column(nullable=True)
    leader_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[StatusEnum] = mapped_column()
