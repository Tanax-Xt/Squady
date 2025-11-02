from typing import Sequence

from fastapi import APIRouter, HTTPException, status

from src.api.fields import EntityId
from src.api.resumes.fields import ResumeItemTitle, ResumeSkill
from src.api.resumes.queries import ResumeQueryParamsDepends
from src.api.resumes.schemas import (
    ResumeCreateRequest,
    ResumeResponse,
    ResumeUpdateRequest,
    ResumeWithUserResponse,
)
from src.api.resumes.service import ResumeServiceDepends
from src.api.tags import Tag
from src.api.users.me.deps import (
    CURRENT_USER_DEPENDS_RESPONSES,
    CurrentUserVerifiedDepends,
    CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
)
from src.pagination import PaginationSearchParamsDepends

router = APIRouter(prefix="/resumes", tags=[Tag.RESUMES], responses=CURRENT_USER_DEPENDS_RESPONSES)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_201_CREATED: dict(
            model=ResumeResponse,
            description="Resume successful created",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="Resume with this role already exists. Use PUT method to update it.",
        ),
    },
    response_model=ResumeResponse,
)
async def create_resume(
    resume: ResumeCreateRequest,
    service: ResumeServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> ResumeResponse:
    if await service.get_resume_by_user_id_and_role(current_user.id, resume.role) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Resume with this role already exists. Use PUT method to update it.",
        )

    db_resume = await service.create_resume(current_user.id, resume)
    return ResumeResponse.from_orm(db_resume)


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[ResumeWithUserResponse],
)
async def get_resumes(
    search_params: PaginationSearchParamsDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
    service: ResumeServiceDepends,
    query_params: ResumeQueryParamsDepends,
) -> list[ResumeWithUserResponse]:
    return [
        ResumeWithUserResponse.from_orm(resume)
        for resume in await service.get_resumes(current_user.id, search_params, query_params)
    ]


@router.get(
    "/roles",
    status_code=status.HTTP_200_OK,
    response_model=Sequence[ResumeItemTitle],
)
async def get_roles(
    search_params: PaginationSearchParamsDepends,
    service: ResumeServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> Sequence[ResumeItemTitle]:
    return await service.get_roles_names(search_params)


@router.get(
    "/skills",
    status_code=status.HTTP_200_OK,
    response_model=Sequence[ResumeSkill],
)
async def get_skills(
    search_params: PaginationSearchParamsDepends,
    service: ResumeServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> Sequence[ResumeSkill]:
    return await service.get_skills_names(search_params)


@router.get(
    "/{resume_id}",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_403_FORBIDDEN: dict(
            description="Сannot get a private resume that does not belong to the current user",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Resume not found",
        ),
    },
    response_model=ResumeResponse,
)
async def get_resume(
    resume_id: EntityId, service: ResumeServiceDepends, current_user: CurrentUserVerifiedDepends
) -> ResumeResponse:
    resume = await service.get_resume_by_id(resume_id)

    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if resume.user_id != current_user.id and resume.is_public is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Сannot get a private resume that does not belong to the current user",
        )

    return ResumeResponse.from_orm(resume)


@router.put(
    "/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Resume successfully deleted",
        ),
        status.HTTP_403_FORBIDDEN: dict(
            description="Сannot edit a resume that does not belong to the current user",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Resume not found",
        ),
        status.HTTP_409_CONFLICT: dict(
            description="Resume with this role already exists. Use PUT method to update it.",
        ),
    },
)
async def update_resume(
    resume_id: EntityId,
    args: ResumeUpdateRequest,
    service: ResumeServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> None:
    resume = await service.get_resume_by_id(resume_id)

    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Сannot edit a resume that does not belong to the current user",
        )

    if (
        await service.get_resume_by_user_id_and_role(current_user.id, args.role) is not None
        and resume.role_name != args.role
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Resume with this role already exists. Use PUT method to update it.",
        )

    await service.update_resume(resume, args)


@router.delete(
    "/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_204_NO_CONTENT: dict(
            description="Resume successfully deleted",
        ),
        status.HTTP_403_FORBIDDEN: dict(
            description="Сannot delete a resume that does not belong to the current user",
        ),
        status.HTTP_404_NOT_FOUND: dict(
            description="Resume not found",
        ),
    },
)
async def delete_resume(
    resume_id: EntityId,
    service: ResumeServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> None:
    resume = await service.get_resume_by_id(resume_id)

    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if resume.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Сannot delete a resume that does not belong to the current user",
        )

    await service.delete_resume(resume)
