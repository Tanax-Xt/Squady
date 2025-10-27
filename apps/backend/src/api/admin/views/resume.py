from sqladmin import ModelView
from sqladmin.filters import BooleanFilter

from src.api.resumes.models import Resume


class ResumeAdminModelView(ModelView, model=Resume):
    category = "Resumes"
    category_icon = "fa-solid fa-file"

    icon = "fa-solid fa-file"
    can_create = False

    column_list = (Resume.id, Resume.role, Resume.is_public, Resume.is_parsed, Resume.user)

    column_filters = (
        BooleanFilter(Resume.is_public),
        BooleanFilter(Resume.is_parsed),
    )

    column_default_sort = (Resume.created_at, False)

    column_sortable_list = column_list

    column_searchable_list = (Resume.id, Resume.user_data, Resume.role_name, Resume.skills_names)

    column_details_list = (
        Resume.id,
        Resume.role,
        Resume.skills,
        Resume.education,
        Resume.experience,
        Resume.achievements,
        Resume.additional_education,
        Resume.is_public,
        Resume.is_parsed,
        Resume.created_at,
        Resume.updated_at,
    )

    form_include_pk = True

    form_edit_rules = [
        "role",
        "skills",
        "education",
        "experience",
        "achievements",
        "additional_education",
        "is_public",
        "is_parsed",
        "created_at",
        "updated_at",
    ]

    form_widget_args = dict(
        id=dict(readonly=True),
        created_at=dict(readonly=True),
        updated_at=dict(readonly=True),
    )
