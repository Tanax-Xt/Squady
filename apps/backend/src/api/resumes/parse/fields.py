from typing import Annotated

from pydantic import Field, StringConstraints

from src.settings import settings

ResumeGithubLink = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        pattern=settings.api.resume_github_link_pattern,
    ),
    Field(
        title="GitHub link",
        description="Link to GitHub profile",
        examples=["https://github.com/Tanax-Xt", "github.com/zobweyt"],
    ),
]


ResumeHeadHunterLink = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        pattern=settings.api.resume_hh_link_pattern,
    ),
    Field(
        title="HeadHunter link",
        description='Link to headhunter resume. The visibility of the resume should be "available by reference"',
        examples=["https://hh.ru/resume/resume_id", "headhunter.ru/resume/resume_id"],
    ),
]
