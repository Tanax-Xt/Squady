from typing import Annotated

from pydantic import AfterValidator, Field, StringConstraints

# from src.api.resumes.schemas import ExperienceItem
from src.api.resumes.validators import validate_achievement_year, validate_date_iso8601, validate_education_end_year
from src.settings import settings

ResumeItemTitle = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.resume_item_title_max_length,
    ),
    Field(title="Title", description="Resume item title", examples=["Title"]),
]

ResumeSkill = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.resume_skill_max_length,
    ),
    Field(title="Skill", description="Resume skill", examples=["Python", "FastAPI"]),
]

ResumeSkillsList = Annotated[
    list[ResumeSkill],
    Field(
        title="List of skills",
        description="List of resume skills",
        examples=[["Python", "FastAPI"]],
        min_length=settings.api.resume_skills_min_count,
        max_length=settings.api.resume_skills_max_count,
    ),
]

ResumeDateIso8601 = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        pattern=settings.api.resume_date_iso8601_pattern,
    ),
    Field(
        title="Date",
        description=f"Date in ISO 8601 format: YYYY-MM. Should be maximum {settings.api.resume_item_date_max_years_ago} years ago and {settings.api.resume_item_date_max_years_future} years in the future.",  # noqa: E501
        examples=["2022-01"],
    ),
    AfterValidator(validate_date_iso8601),
]

ResumeEducationEndYear = Annotated[
    int,
    Field(
        title="The end year of education",
        description=f"The end year of education should be maximum {settings.api.resume_item_date_max_years_ago} years ago and {settings.api.resume_item_date_max_years_future} years in the future.",  # noqa: E501
        examples=[2025],
    ),
    AfterValidator(validate_education_end_year),
]

ResumeAchievementYear = Annotated[
    int,
    Field(
        title="The year of the achievement",
        description="The year of achievement should be no more than the current year.",
        examples=[2025],
    ),
    AfterValidator(validate_achievement_year),
]
