from sqladmin import ModelView

from src.api.users.models import TeamToUser


class TeamToUserAdminModelView(ModelView, model=TeamToUser):
    category = "Teams"
    category_icon = "fa-solid fa-people-group"

    icon = "fa-solid fa-link"
    can_create = False

    column_list = (TeamToUser.team_id, TeamToUser.user_id, TeamToUser.resume_id)

    column_sortable_list = column_list

    column_searchable_list = column_list

    form_include_pk = True

    form_widget_args = dict(
        id=dict(readonly=True),
    )
