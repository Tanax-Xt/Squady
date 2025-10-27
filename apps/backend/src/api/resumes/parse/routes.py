from fastapi import APIRouter, HTTPException, UploadFile, status

from src.api.resumes.parse.enums import ParsingSource, ParsingStatus
from src.api.resumes.parse.schemas import (
    ResumeParsedResponse,
    ResumeParseFromGithubRequest,
    ResumeParseFromHeadHunterRequest,
)
from src.api.resumes.parse.service import ResumeParseServiceDepends
from src.api.resumes.parse.validators import is_pdf, is_size_in_range
from src.api.users.me.deps import CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends
from src.settings import settings

router = APIRouter(prefix="/parse")


@router.post(
    "/github",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: dict(
            description="Failed to parse resume from GitHub",
        ),
    },
    response_model=ResumeParsedResponse,
)
async def parse_resume_from_github(
    args: ResumeParseFromGithubRequest,
    service: ResumeParseServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> ResumeParsedResponse:
    resume = await service.get_parsed_resume_from_github_or_none(args)

    if resume is None:
        await service.create_resume_parse_log(current_user.id, ParsingSource.github, ParsingStatus.error_400)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Failed to parse resume from GitHub.")

    await service.create_resume_parse_log(current_user.id, ParsingSource.github, ParsingStatus.success_200)

    return resume


@router.post(
    "/pdf",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: dict(
            description="Failed to parse resume",
        ),
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE: dict(
            description="File size exceeded maximum resume size",
        ),
        status.HTTP_415_UNSUPPORTED_MEDIA_TYPE: dict(
            description="File type must be application/pdf",
        ),
    },
)
async def parse_resume_from_pdf(
    file: UploadFile,
    service: ResumeParseServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> ResumeParsedResponse:
    if not is_size_in_range(file.file, max_size=settings.api.resume_max_pdf_size):
        mb = settings.api.resume_max_pdf_size / (1024**2)
        await service.create_resume_parse_log(current_user.id, ParsingSource.pdf, ParsingStatus.error_413)
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            f"File size exceeded maximum resume size: {mb} MB.",
        )

    if not is_pdf(file.content_type):
        await service.create_resume_parse_log(current_user.id, ParsingSource.pdf, ParsingStatus.error_415)
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            "File type must be application/pdf",
        )

    resume = await service.get_parsed_resume_from_pdf_or_none(file)

    if resume is None:
        await service.create_resume_parse_log(current_user.id, ParsingSource.pdf, ParsingStatus.error_400)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Failed to parse resume from PDF.")

    await service.create_resume_parse_log(current_user.id, ParsingSource.pdf, ParsingStatus.success_200)

    return resume


@router.post(
    "/hh",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: dict(
            description="Failed to parse resume",
        ),
    },
)
async def parse_resume_from_headhunter(
    args: ResumeParseFromHeadHunterRequest,
    service: ResumeParseServiceDepends,
    current_user: CurrentUserVerifiedParticipantOrMentorWithPersonalDataDepends,
) -> ResumeParsedResponse:
    resume = await service.get_parsed_resume_from_hh_or_none(args)

    if resume is None:
        await service.create_resume_parse_log(current_user.id, ParsingSource.hh, ParsingStatus.error_400)
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Failed to parse resume from HeadHunter.")

    await service.create_resume_parse_log(current_user.id, ParsingSource.hh, ParsingStatus.success_200)

    return resume
