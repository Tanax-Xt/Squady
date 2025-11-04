from sqladmin import ModelView
from sqladmin.filters import StaticValuesFilter

from src.api.teams.enum import StatusEnum
from src.api.teams.models import Team


class TeamAdminModelView(ModelView, model=Team):
    category = "Teams"
    category_icon = "fa-solid fa-people-group"

    icon = "fa-solid fa-people-group"
    can_create = False

    column_list = (Team.id, Team.title, Team.leader_id, Team.status)

    column_filters = (StaticValuesFilter(Team.status, [(i.name, i.name) for i in StatusEnum]),)

    column_default_sort = (Team.created_at, False)

    column_sortable_list = column_list

    column_searchable_list = (Team.id, Team.title, Team.about, Team.tasks, Team.leader_id, Team.status)

    form_include_pk = True

    form_widget_args = dict(
        id=dict(readonly=True),
        created_at=dict(readonly=True),
        updated_at=dict(readonly=True),
    )
