from typing import Literal

from src.api.fields import EntityId
from src.api.resumes.models import Resume
from src.api.resumes.schemas import ResumeResponse
from src.api.schemas import AuditBaseModel, BaseSchema
from src.api.teams.application.enum import ApplicationStatusEnum
from src.api.teams.application.models import ApplicationToTeam
from src.api.users.fields import UserEmail
from src.api.users.models import User
from src.api.users.schemas import UserPersonalDataResponse


class ApplicationCreateRequest(BaseSchema):
    resume_id: EntityId


class ApplicationUpdateRequest(BaseSchema):
    status: Literal[ApplicationStatusEnum.accepted, ApplicationStatusEnum.rejected]


class ApplicationSendEmailRequest(BaseSchema):
    email: UserEmail


class ApplicationResponse(AuditBaseModel):
    id: EntityId
    team_id: EntityId
    user: UserPersonalDataResponse
    resume: ResumeResponse
    status: ApplicationStatusEnum

    @classmethod
    def from_orm(cls, application: ApplicationToTeam, user: User, resume: Resume) -> "ApplicationResponse":  # type: ignore[override]
        return cls(
            id=application.id,  # type: ignore
            team_id=application.team_id,
            user=UserPersonalDataResponse(**user.__dict__),
            resume=ResumeResponse.from_orm(resume),
            created_at=application.created_at,
            updated_at=application.updated_at,
            status=application.status,
        )
