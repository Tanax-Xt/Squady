from typing import Sequence

from src.api.fields import EntityId
from src.api.resumes.models import Resume
from src.api.resumes.schemas import ResumeResponse
from src.api.schemas import AuditBaseModel, BaseSchema
from src.api.teams.enum import MemberStatusEnum, StatusEnum
from src.api.teams.fields import TeamTextField, TeamTitle
from src.api.teams.models import Team
from src.api.users.models import User
from src.api.users.schemas import UserPersonalDataResponse


class TeamCreateRequest(BaseSchema):
    title: TeamTitle
    about: TeamTextField | None
    tasks: TeamTextField | None
    lead_resume_id: EntityId


class TeamUpdateRequest(BaseSchema):
    title: TeamTitle
    about: TeamTextField | None
    tasks: TeamTextField | None


class TeamAddUserRequest(BaseSchema):
    user_id: EntityId
    resume_id: EntityId


class MemberResponse(UserPersonalDataResponse):
    status: MemberStatusEnum = MemberStatusEnum.active
    resume: ResumeResponse

    @classmethod
    def from_orm(cls, user: User, resume: Resume) -> "MemberResponse":  # type: ignore[override]
        return MemberResponse(**user.__dict__, resume=ResumeResponse.from_orm(resume))


class TeamResponse(AuditBaseModel):
    id: EntityId
    title: TeamTitle
    about: TeamTextField | None
    tasks: TeamTextField | None
    leader_id: EntityId
    status: StatusEnum
    users: list[MemberResponse]

    @classmethod
    def from_orm(  # type: ignore[override]
        cls,
        team: Team,
        users: Sequence[User],
        resumes: list[Resume],
    ) -> "TeamResponse":
        try:
            return TeamResponse(
                **team.__dict__, users=[MemberResponse.from_orm(users[i], resumes[i]) for i in range(len(users))]
            )
        except Exception:
            return TeamResponse(**team.__dict__, users=[])
