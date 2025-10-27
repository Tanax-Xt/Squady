from src.api.resumes.fields import ResumeItemTitle, ResumeSkillsList
from src.api.resumes.parse.fields import ResumeGithubLink, ResumeHeadHunterLink
from src.api.resumes.schemas import (
    ResumeAchievementsList,
    ResumeAdditionalEducationsList,
    ResumeEducation,
    ResumeExperiencesList,
)
from src.api.schemas import BaseSchema


class ResumeParseFromGithubRequest(BaseSchema):
    url: ResumeGithubLink


class ResumeParseFromHeadHunterRequest(BaseSchema):
    url: ResumeHeadHunterLink


class ResumeParsedResponse(BaseSchema):
    role: ResumeItemTitle | None
    skills: ResumeSkillsList | None
    education: ResumeEducation | None
    experience: ResumeExperiencesList | None
    achievements: ResumeAchievementsList | None
    additional_education: ResumeAdditionalEducationsList | None
    is_public: bool = True
    is_parsed: bool = True
