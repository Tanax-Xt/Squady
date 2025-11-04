from sqladmin import ModelView
from sqladmin.filters import StaticValuesFilter

from src.api.teams.application.enum import ApplicationStatusEnum
from src.api.teams.application.models import ApplicationToTeam


class ApplicationAdminModelView(ModelView, model=ApplicationToTeam):
    category = "Teams"
    category_icon = "fa-solid fa-people-group"

    icon = "fa-solid fa-file-pen"
    can_create = False

    column_list = (
        ApplicationToTeam.id,
        ApplicationToTeam.user_id,
        ApplicationToTeam.team_id,
        ApplicationToTeam.resume_id,
        ApplicationToTeam.status,
    )

    column_filters = (StaticValuesFilter(ApplicationToTeam.status, [(i.name, i.name) for i in ApplicationStatusEnum]),)

    column_default_sort = (ApplicationToTeam.updated_at, False)

    column_sortable_list = column_list

    column_searchable_list = column_list

    form_include_pk = True

    form_widget_args = dict(
        id=dict(readonly=True),
        created_at=dict(readonly=True),
        updated_at=dict(readonly=True),
    )
