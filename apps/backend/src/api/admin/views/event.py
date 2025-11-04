from sqladmin import ModelView
from sqladmin.filters import StaticValuesFilter

from src.api.events.enum import EventType
from src.api.events.models import Event


class EventAdminModelView(ModelView, model=Event):
    category = "Events"
    category_icon = "fa-solid fa-calendar-days"

    icon = "fa-solid fa-calendar-days"
    can_create = False

    column_list = (Event.id, Event.title, Event.start_date, Event.end_date, Event.format)

    column_filters = (StaticValuesFilter(Event.format, [(i.name, i.name) for i in EventType]),)

    column_default_sort = (Event.created_at, False)

    column_sortable_list = column_list

    column_searchable_list = (Event.id, Event.agent_id, Event.title, Event.description, Event.location)

    form_include_pk = True

    form_widget_args = dict(
        id=dict(readonly=True),
        created_at=dict(readonly=True),
        updated_at=dict(readonly=True),
    )
