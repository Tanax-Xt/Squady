from datetime import date
from typing import Annotated, Self

from pydantic import Field, model_validator

from src.api.fields import EntityId
from src.api.resumes.enums import EducationType
from src.api.resumes.fields import (
    ResumeAchievementYear,
    ResumeDateIso8601,
    ResumeEducationEndYear,
    ResumeItemTitle,
    ResumeSkillsList,
)
from src.api.resumes.models import Resume
from src.api.schemas import AuditBaseModel, BaseSchema
from src.api.users.enums import UserRole
from src.api.users.fields import UserAbout, UserBirthDate, UserCity, UserEmail, UserFullName, UserTelegram, UserUsername
from src.api.users.models import User
from src.pagination import PaginationResponse
from src.settings import settings


class ResumeEducation(BaseSchema):
    type: EducationType
    title: ResumeItemTitle
    end_year: ResumeEducationEndYear


class ExperienceItem(BaseSchema):
    title: ResumeItemTitle
    description: str
    start_date: ResumeDateIso8601
    end_date: ResumeDateIso8601 | None = None
    is_work: bool = False
    company: ResumeItemTitle | None = None

    @model_validator(mode="after")
    def check_dates(self) -> Self:
        if self.end_date and _to_date(self.start_date) > _to_date(self.end_date):
            raise ValueError("start_date cannot be after end_date")
        return self


ResumeExperiencesList = Annotated[
    list[ExperienceItem],
    Field(
        title="List of experiences",
        description="List of resume experiences",
        min_length=settings.api.resume_experiences_min_count,
        max_length=settings.api.resume_experiences_max_count,
    ),
]


class AchievementItem(BaseSchema):
    title: ResumeItemTitle
    year: ResumeAchievementYear


ResumeAchievementsList = Annotated[
    list[AchievementItem],
    Field(
        title="List of achievements",
        description="List of resume achievements",
        min_length=settings.api.resume_achievements_min_count,
        max_length=settings.api.resume_achievements_max_count,
    ),
]


class AdditionalEducationItem(BaseSchema):
    title: ResumeItemTitle
    start_date: ResumeDateIso8601
    end_date: ResumeDateIso8601

    @model_validator(mode="after")
    def check_dates(self) -> Self:
        if _to_date(self.start_date) > _to_date(self.end_date):
            raise ValueError("start_date cannot be after end_date")
        return self


ResumeAdditionalEducationsList = Annotated[
    list[AdditionalEducationItem],
    Field(
        title="List of additional educations",
        description="List of resume additional educations",
        min_length=settings.api.resume_additional_educations_min_count,
        max_length=settings.api.resume_additional_educations_max_count,
    ),
]


class ResumeCreateRequest(BaseSchema):
    role: ResumeItemTitle
    skills: ResumeSkillsList
    education: ResumeEducation
    experience: ResumeExperiencesList | None
    achievements: ResumeAchievementsList | None
    additional_education: ResumeAdditionalEducationsList | None
    is_public: bool = True
    is_parsed: bool = False


class ResumeUpdateRequest(BaseSchema):
    role: ResumeItemTitle
    skills: ResumeSkillsList
    education: ResumeEducation
    experience: ResumeExperiencesList | None
    achievements: ResumeAchievementsList | None
    additional_education: ResumeAdditionalEducationsList | None
    is_public: bool


class ResumeUserPersonalDataResponse(BaseSchema):
    full_name: UserFullName | None
    birth_date: UserBirthDate | None
    city: UserCity | None
    about: UserAbout | None
    telegram: UserTelegram | None

    @classmethod
    def from_orm(cls, user: User) -> "ResumeUserPersonalDataResponse":
        return cls(
            full_name=user.full_name,
            birth_date=user.birth_date,
            city=user.city,
            about=user.about,
            telegram=user.telegram,
        )


class ResumeResponse(AuditBaseModel):
    id: EntityId
    owner_id: EntityId
    personal_data: ResumeUserPersonalDataResponse
    role: ResumeItemTitle
    skills: ResumeSkillsList
    education: ResumeEducation
    experience: ResumeExperiencesList | None
    achievements: ResumeAchievementsList | None
    additional_education: ResumeAdditionalEducationsList | None
    is_public: bool = True

    @classmethod
    def from_orm(cls, resume: Resume) -> "ResumeResponse":
        return cls(
            id=resume.id,  # type: ignore
            owner_id=resume.user_id,
            personal_data=ResumeUserPersonalDataResponse.from_orm(resume.user),
            role=resume.role.name,
            skills=[skill.name for skill in resume.skills],
            education=resume.education,  # type: ignore
            experience=resume.experience,  # type: ignore
            achievements=resume.achievements,  # type: ignore
            additional_education=resume.additional_education,  # type: ignore
            is_public=resume.is_public,
            created_at=resume.created_at,
            updated_at=resume.updated_at,
        )


class UserResponse(AuditBaseModel):
    """Represents the public response data for a user."""

    id: EntityId
    username: UserUsername
    email: UserEmail
    role: UserRole | None
    about: UserAbout | None
    is_verified: bool
    is_verified_agent: bool | None


class ResumeWithUserResponse(AuditBaseModel):
    id: EntityId
    owner_id: EntityId
    personal_data: ResumeUserPersonalDataResponse
    role: ResumeItemTitle
    skills: ResumeSkillsList
    education: ResumeEducation
    experience: ResumeExperiencesList | None
    achievements: ResumeAchievementsList | None
    additional_education: ResumeAdditionalEducationsList | None
    is_public: bool = True
    user: UserResponse

    @classmethod
    def from_orm(cls, resume: Resume) -> "ResumeWithUserResponse":
        return cls(
            id=resume.id,  # type: ignore
            owner_id=resume.user_id,
            personal_data=ResumeUserPersonalDataResponse.from_orm(resume.user),
            role=resume.role.name,
            skills=[skill.name for skill in resume.skills],
            education=resume.education,  # type: ignore
            experience=resume.experience,  # type: ignore
            achievements=resume.achievements,  # type: ignore
            additional_education=resume.additional_education,  # type: ignore
            is_public=resume.is_public,
            user=UserResponse(**resume.user.__dict__),
            created_at=resume.created_at,
            updated_at=resume.updated_at,
        )


class ResumesPaginationResponse(BaseSchema):
    resumes: list[ResumeResponse]
    pagination: PaginationResponse


class ResumesRolesPaginationResponse(BaseSchema):
    roles: list[ResumeItemTitle]
    pagination: PaginationResponse


def _to_date(date_str: ResumeDateIso8601) -> date:
    return date.fromisoformat(f"{date_str}-01")
