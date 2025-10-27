import uuid
from typing import TYPE_CHECKING, Any, ClassVar

from sqlalchemy import Column, ForeignKey, Index, Select, Table, func, select
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, MappedSQLExpression, column_property, mapped_column, relationship, selectinload

from src.db import AuditMixin, Base

if TYPE_CHECKING:
    from src.api.users.models import User

resume_to_skill = Table(
    "resume_to_skill",
    Base.metadata,
    Column("resume_id", UUID(as_uuid=True), ForeignKey("resume.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", UUID(as_uuid=True), ForeignKey("skill.id", ondelete="CASCADE"), primary_key=True),
)


class Role(Base, AuditMixin):
    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(index=True, unique=True)
    resumes: Mapped[list["Resume"]] = relationship("Resume", back_populates="role")

    __repr_attrs__ = ("name",)

    __table_args__ = (
        Index(
            "ix_role_name_trgm",
            func.lower(name),
            postgresql_using="gin",
            postgresql_ops={"lower(name)": "gin_trgm_ops"},
            info={"skip_for_create_all": True},
        ),
        Index(
            "uq_role_name_lower",
            func.lower(name),
            unique=True,
        ),
    )


class Skill(Base, AuditMixin):
    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(index=True, unique=True)
    resumes: Mapped[list["Resume"]] = relationship("Resume", secondary=resume_to_skill, back_populates="skills")

    __repr_attrs__ = ("name",)

    __table_args__ = (
        Index(
            "ix_skill_name_trgm",
            func.lower(name),
            postgresql_using="gin",
            postgresql_ops={"lower(name)": "gin_trgm_ops"},
            info={"skip_for_create_all": True},
        ),
        Index(
            "uq_skill_name_lower",
            func.lower(name),
            unique=True,
        ),
    )


class Resume(Base, AuditMixin):
    id: Mapped[str] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("role.id", ondelete="CASCADE"), nullable=False
    )
    skills: Mapped[list["Skill"]] = relationship(Skill, secondary=resume_to_skill, back_populates="resumes")
    education: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    experience: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=True)
    achievements: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=True)
    additional_education: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=True)
    is_public: Mapped[bool] = mapped_column(default=True, nullable=False)
    is_parsed: Mapped[bool] = mapped_column(default=False, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="resumes")
    role: Mapped["Role"] = relationship("Role", back_populates="resumes")

    from src.api.users.models import User

    user_data = column_property(
        select(
            func.concat_ws(
                " ",
                User.username,
                User.email,
                User.full_name,
            )
        )
        .where(User.id == user_id)
        .correlate_except(User)
        .scalar_subquery()
    )

    role_name = column_property(select(Role.name).where(Role.id == role_id).correlate_except(Role).scalar_subquery())

    skills_names: ClassVar[MappedSQLExpression[str]]

    @classmethod
    def select_with_relations(cls) -> Select[Any]:
        return select(cls).options(
            selectinload(cls.role),
            selectinload(cls.skills),
            selectinload(cls.user),
        )

    __repr_attrs__ = ("user_data", "role_name")


Resume.skills_names = column_property(
    select(func.string_agg(Skill.name, ", "))
    .select_from(resume_to_skill.join(Skill, resume_to_skill.c.skill_id == Skill.id))
    .where(resume_to_skill.c.resume_id == Resume.id)
    .scalar_subquery()
)
