from sqladmin import ModelView
from wtforms.validators import Length

from src.api.resumes.models import Skill
from src.settings import settings


class SkillAdminModelView(ModelView, model=Skill):
    category = "Resumes"
    category_icon = "fa-solid fa-file"

    icon = "fa-solid fa-star"

    column_list = (Skill.id, Skill.name)

    form_edit_rules = ["name"]

    form_create_rules = ["name"]

    form_args = dict(
        name=dict(
            validators=[
                Length(max=settings.api.resume_skill_max_length),
            ]
        ),
    )

    form_widget_args = dict(
        id=dict(readonly=True),
        created_at=dict(readonly=True),
        updated_at=dict(readonly=True),
    )
