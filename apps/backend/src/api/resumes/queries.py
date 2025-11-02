from typing import Annotated, Self

from fastapi import Depends, Query
from pydantic import NonNegativeInt, model_validator

from src.api.resumes.enums import EducationType
from src.api.resumes.fields import ResumeSkill
from src.api.schemas import BaseSchema
from src.settings import settings

ResumeQueryEducationTypesList = Annotated[
    list[EducationType] | None,
    Query(
        title="List of education types",
        description="List of education types",
        examples=[["primary_school", "high_school"]],
        max_length=len([e for e in EducationType]),
    ),
]

ResumeQuerySkillsList = Annotated[
    list[ResumeSkill] | None,
    Query(
        title="List of skills",
        description="List of resume skills",
        examples=[["Python", "FastAPI"]],
        min_length=settings.api.resume_skills_min_count,
        max_length=settings.api.resume_skills_max_count,
    ),
]

ResumeQueryYearsExperienceCount = Annotated[
    NonNegativeInt | None,
    Query(
        title="Years experience count",
        description="Years experience count",
        ge=settings.api.resume_query_years_experience_min_count,
        le=settings.api.resume_query_years_experience_max_count,
    ),
]

ResumeQueryProjectsCount = Annotated[
    NonNegativeInt | None,
    Query(
        title="Projects count",
        description="Projects count",
        ge=settings.api.resume_query_projects_min_count,
        le=settings.api.resume_query_projects_max_count,
    ),
]


class ResumeQueryParams(BaseSchema):
    skills: ResumeQuerySkillsList = None
    education_types: ResumeQueryEducationTypesList = None
    experience_years_from: ResumeQueryYearsExperienceCount = None
    experience_years_to: ResumeQueryYearsExperienceCount = None
    projects_count_from: ResumeQueryProjectsCount = None
    projects_count_to: ResumeQueryProjectsCount = None

    @model_validator(mode="after")
    def check_years(self) -> Self:
        if (
            self.experience_years_from is not None
            and self.experience_years_to is not None
            and self.experience_years_from > self.experience_years_to
        ):
            raise ValueError("experience_years_from cannot be greater than experience_years_to")
        if (
            self.projects_count_from is not None
            and self.projects_count_to is not None
            and self.projects_count_from > self.projects_count_to
        ):
            raise ValueError("projects_count_from cannot be greater than projects_count_to")
        return self


def get_resume_query_params(
    skills: ResumeQuerySkillsList = None,
    education_types: ResumeQueryEducationTypesList = None,
    experience_years_from: ResumeQueryYearsExperienceCount = None,
    experience_years_to: ResumeQueryYearsExperienceCount = None,
    projects_count_from: ResumeQueryProjectsCount = None,
    projects_count_to: ResumeQueryProjectsCount = None,
) -> ResumeQueryParams:
    return ResumeQueryParams(
        skills=skills,
        education_types=education_types,
        experience_years_from=experience_years_from,
        experience_years_to=experience_years_to,
        projects_count_from=projects_count_from,
        projects_count_to=projects_count_to,
    )


ResumeQueryParamsDepends = Annotated[ResumeQueryParams, Depends(get_resume_query_params)]
