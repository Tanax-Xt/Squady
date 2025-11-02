from typing import Annotated

from fastapi import Depends

from src.api.resumes.queries import ResumeQueryEducationTypesList, ResumeQuerySkillsList
from src.api.schemas import BaseSchema


class TeamQueryParams(BaseSchema):
    skills: ResumeQuerySkillsList = None
    education_types: ResumeQueryEducationTypesList = None


def get_team_query_params(
    skills: ResumeQuerySkillsList = None,
    education_types: ResumeQueryEducationTypesList = None,
) -> TeamQueryParams:
    return TeamQueryParams(
        skills=skills,
        education_types=education_types,
    )


TeamQueryParamsDepends = Annotated[TeamQueryParams, Depends(get_team_query_params)]
