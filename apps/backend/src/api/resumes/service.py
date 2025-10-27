from typing import Annotated, Sequence
from uuid import UUID

from fastapi import Depends

from src.api.resumes.models import Resume
from src.api.resumes.repository import ResumeRepositoryDepends
from src.api.resumes.schemas import ResumeCreateRequest, ResumeResponse, ResumesPaginationResponse, ResumeUpdateRequest
from src.pagination import PaginationResponse, PaginationSearchParams


class ResumeService:
    def __init__(self, repository: ResumeRepositoryDepends) -> None:
        self.repository = repository

    async def get_resume_by_id(self, id: str | UUID) -> Resume | None:
        return await self.repository.get_by_id(id)

    async def get_resume_by_user_id_and_role(self, user_id: str | UUID, role: str) -> Resume | None:
        return await self.repository.get_by_user_id_and_role(user_id, role)

    async def get_resumes_by_user_id(
        self, user_id: str | UUID, requester_user_id: str | UUID, search_params: PaginationSearchParams | None = None
    ) -> Sequence[Resume]:
        return await self.repository.get_by_user_id(user_id, requester_user_id, search_params)

    async def get_resumes_count(
        self, user_id: str | UUID, requester_user_id: str | UUID, search_params: PaginationSearchParams | None = None
    ) -> int:
        return await self.repository.get_count(user_id, requester_user_id, search_params)

    async def get_user_resumes_pagination(
        self, user_id: str | UUID, requester_user_id: str | UUID, search_params: PaginationSearchParams
    ) -> ResumesPaginationResponse:
        resumes = await self.get_resumes_by_user_id(user_id, requester_user_id, search_params)
        resumes_count = await self.get_resumes_count(user_id, requester_user_id, search_params)

        resumes_schema = [ResumeResponse.from_orm(resume) for resume in resumes]
        pagination = PaginationResponse.from_search_params(search_params, total_items=resumes_count)

        return ResumesPaginationResponse(resumes=resumes_schema, pagination=pagination)

    async def create_resume(self, user_id: str | UUID, args: ResumeCreateRequest) -> Resume:
        seen = set()
        unique_skills = [s for s in args.skills if (key := s.lower()) not in seen and not seen.add(key)]  # type: ignore

        skills = await self.repository.create_and_get_skills_by_names(unique_skills)
        role = await self.repository.create_and_get_role_by_name(args.role)

        resume = Resume(
            user_id=user_id,
            role_id=role.id,
            skills=skills,
            education=args.education.dict(),
            experience=[ei.dict() for ei in args.experience] if args.experience is not None else None,
            achievements=[ai.dict() for ai in args.achievements] if args.achievements is not None else None,
            additional_education=[ae.dict() for ae in args.additional_education]
            if args.additional_education is not None
            else None,
            is_public=args.is_public,
            is_parsed=args.is_parsed,
        )

        return await self.repository.create(resume)

    async def update_resume(self, resume: Resume, args: ResumeUpdateRequest) -> None:
        data_to_update = args.model_dump()

        role = await self.repository.create_and_get_role_by_name(data_to_update.pop("role"))
        data_to_update["role_id"] = role.id

        skills = await self.repository.create_and_get_skills_by_names(data_to_update.pop("skills"))
        data_to_update["skills"] = skills

        resume.update(data_to_update)

        await self.repository.update(resume)

    async def delete_resume(self, resume: Resume) -> None:
        await self.repository.delete(resume)

    async def get_roles_names(self, search_params: PaginationSearchParams | None = None) -> Sequence[str]:
        return await self.repository.get_roles_names_with_pagination(search_params)

    async def get_skills_names(self, search_params: PaginationSearchParams | None = None) -> Sequence[str]:
        return await self.repository.get_skills_names_with_pagination(search_params)


ResumeServiceDepends = Annotated[ResumeService, Depends(ResumeService)]
