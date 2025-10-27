from typing import Any

from sqladmin import ModelView
from sqladmin.filters import BooleanFilter
from starlette.requests import Request
from wtforms import EmailField, PasswordField, TextAreaField
from wtforms.validators import Length, Regexp

from src.api.admin.filters import NullableStaticValuesFilter
from src.api.users.enums import UserRole
from src.api.users.models import User
from src.security import get_password_hash
from src.settings import settings


class UserAdminModelView(ModelView, model=User):
    icon = "fa-solid fa-user"

    column_list = (User.id, User.username, User.full_name, User.email, User.telegram, User.role, User.is_verified)

    column_filters = (
        NullableStaticValuesFilter(
            User.role,
            [
                (UserRole.admin, UserRole.admin.capitalize()),
                (UserRole.agent, UserRole.agent.capitalize()),
                (UserRole.mentor, UserRole.mentor.capitalize()),
                (UserRole.participant, UserRole.participant.capitalize()),
            ],
        ),
        BooleanFilter(User.is_verified),
        BooleanFilter(User.is_verified_agent),
        BooleanFilter(User.is_superuser),
    )

    column_default_sort = (User.created_at, False)

    column_sortable_list = column_list

    column_searchable_list = (User.id, User.username, User.full_name, User.email, User.telegram)

    column_details_list = (
        User.id,
        User.username,
        User.full_name,
        User.birth_date,
        User.email,
        User.telegram,
        User.city,
        User.role,
        User.about,
        User.is_verified,
        User.is_verified_agent,
        User.is_superuser,
        User.resumes,
        User.created_at,
        User.updated_at,
    )

    form_include_pk = True

    form_create_rules = [
        "username",
        "email",
        "password",
        "role",
        "is_verified",
        "is_verified_agent",
    ]

    form_edit_rules = [
        "id",
        "username",
        "full_name",
        "birth_date",
        "email",
        "telegram",
        "city",
        "role",
        "about",
        "is_verified",
        "is_verified_agent",
        "created_at",
        "updated_at",
    ]

    form_args = dict(
        username=dict(
            validators=[
                Length(min=settings.api.user_username_min_length, max=settings.api.user_username_max_length),
                Regexp(settings.api.user_username_pattern),
            ]
        ),
        password=dict(
            validators=[
                Length(min=settings.api.user_password_min_length, max=settings.api.user_password_max_length),
                Regexp(settings.api.user_password_pattern),
            ],
        ),
    )

    form_overrides = dict(
        email=EmailField,
        password=PasswordField,
        about=TextAreaField,
    )

    form_widget_args = dict(
        id=dict(readonly=True),
        created_at=dict(readonly=True),
        updated_at=dict(readonly=True),
    )

    async def on_model_change(self, data: dict[str, Any], model: User, is_created: bool, request: Request) -> None:
        if is_created:
            data["password"] = await get_password_hash(data["password"])
