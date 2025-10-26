import uuid
from datetime import date

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from src.api.users.enums import UserRole
from src.db import AuditMixin, Base


class User(Base, AuditMixin):
    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(index=True, unique=True)
    email: Mapped[str] = mapped_column(index=True, unique=True)
    password: Mapped[str] = mapped_column()
    role: Mapped[UserRole | None] = mapped_column()
    full_name: Mapped[str | None] = mapped_column()
    birth_date: Mapped[date | None] = mapped_column()
    city: Mapped[str | None] = mapped_column()
    telegram: Mapped[str | None] = mapped_column()
    about: Mapped[str | None] = mapped_column()
    is_verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    is_verified_agent: Mapped[bool | None] = mapped_column()
    is_superuser: Mapped[bool] = mapped_column(default=False, nullable=False)

    __repr_attrs__ = ("id", "username", "email", "role", "is_superuser")
