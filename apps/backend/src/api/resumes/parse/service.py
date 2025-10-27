import asyncio
import json
import re
import ssl
from datetime import date
from typing import Annotated, Any
from uuid import UUID

import aiohttp
import certifi
from aiogithubapi import GitHubAPI, GitHubRepositoryModel, GitHubResponseModel  # type: ignore[import-untyped]
from bs4 import BeautifulSoup, Tag  # type: ignore[import-untyped]
from faker import Faker
from fastapi import Depends, UploadFile
from pypdf import PdfReader

from src.api.resumes.fields import ResumeItemTitle
from src.api.resumes.parse.enums import ParsingSource, ParsingStatus
from src.api.resumes.parse.models import ResumeParseLog
from src.api.resumes.parse.repository import ResumeParseLogRepositoryDepends
from src.api.resumes.parse.schemas import (
    ResumeParsedResponse,
    ResumeParseFromGithubRequest,
    ResumeParseFromHeadHunterRequest,
)
from src.api.resumes.repository import ResumeRepositoryDepends
from src.api.resumes.schemas import AchievementItem, AdditionalEducationItem, ExperienceItem
from src.llm import client, system_prompt, text_pattern, user_prompt
from src.settings import settings


class ResumeParseService:
    def __init__(
        self, resume_repository: ResumeRepositoryDepends, log_repository: ResumeParseLogRepositoryDepends
    ) -> None:
        self.resume_repository = resume_repository
        self.log_repository = log_repository
        self.MONTH_PREFIX = {
            "январь": "01",
            "февраль": "02",
            "март": "03",
            "апрель": "04",
            "май": "05",
            "июнь": "06",
            "июль": "07",
            "август": "08",
            "сентябрь": "09",
            "октябрь": "10",
            "ноябрь": "11",
            "декабрь": "12",
        }
        self.date_pattern = re.compile(
            r"([А-ЯЁа-яё]+)\s+(\d{4})\s*—\s*([А-ЯЁа-яё]+)(?:\s+(\d{4}))?", flags=re.IGNORECASE
        )
        self.present_pattern = re.compile(r"по\s+настоящ(ее|ему)\s+времени|по\s+настояще", flags=re.IGNORECASE)

    async def create_resume_parse_log(self, user_id: str | UUID, source: ParsingSource, status: ParsingStatus) -> None:
        log = ResumeParseLog(user_id=str(user_id), source=source.name, status=status.name)

        await self.log_repository.create(log)

    async def get_parsed_resume_from_github_or_none(
        self, args: ResumeParseFromGithubRequest
    ) -> ResumeParsedResponse | None:
        parsed_data = await self._parse_resume_from_github(args)

        if parsed_data is None:
            return None

        raw_skills = []
        experience = []
        for repo in parsed_data.data:
            if repo.language:
                raw_skills.append(repo.language)
            if repo.topics:
                raw_skills.extend(repo.topics)

            if repo.name == repo.owner.login:
                continue

            experience.append(
                ExperienceItem(
                    title=repo.name,
                    description=repo.description if repo.description else "",
                    start_date=self._to_date_iso8601_from_github_format(repo.created_at),
                    end_date=self._to_date_iso8601_from_github_format(repo.pushed_at) if repo.pushed_at else None,
                    is_work=False,
                )
            )

        raw_skills = list(set(raw_skills))[: settings.api.resume_skills_max_count]
        db_skills = await self.resume_repository.create_and_get_skills_by_names(raw_skills)
        skills = [skill.name for skill in db_skills]

        resume = ResumeParsedResponse(
            role=None,
            skills=skills[: settings.api.resume_skills_max_count],
            education=None,
            experience=experience[: settings.api.resume_experiences_max_count],
            achievements=None,
            additional_education=None,
        )

        return resume

    async def get_parsed_resume_from_hh_or_none(
        self, args: ResumeParseFromHeadHunterRequest
    ) -> ResumeParsedResponse | None:
        text = await self._parse_resume_from_hh(args)

        if text is None:
            return None

        soup = BeautifulSoup(text, "html.parser")

        raw_role = soup.find("span", {"data-qa": "resume-block-title-position"})
        role = _safe(ResumeItemTitle, raw_role.text.strip()) if raw_role else None

        skill_texts = []
        for tag in soup.select('div[data-qa^="skills-table"] span[data-qa="bloko-tag__text"]'):
            skill_texts.append(tag.text.strip())
        raw_skills = sorted(set(skill_texts))[: settings.api.resume_skills_max_count]
        db_skills = await self.resume_repository.create_and_get_skills_by_names(raw_skills)
        skills = [skill.name for skill in db_skills]

        experience_blocks = soup.find_all("div", {"data-qa": "resume-block-experience"})
        experiences = []
        for exp in experience_blocks:
            companies = exp.find_all("div", class_="bloko-text bloko-text_strong")
            companies = companies[::2]
            for c in companies:
                job = c.find_next("div", {"data-qa": "resume-block-experience-position"})
                desc = c.find_next("div", {"data-qa": "resume-block-experience-description"})

                start_date, end_date = self._find_dates_near(c)

                try:
                    experiences.append(
                        ExperienceItem(
                            title=job.text.strip() if job else "",
                            description=desc.text.strip() if desc else "",
                            start_date=start_date,  # type: ignore
                            end_date=end_date,
                            is_work=True,
                            company=c.text.strip(),
                        )
                    )
                except Exception:
                    pass

        additional_education = []
        for block in soup.select('[data-qa="resume-block-education-item"]'):
            year_el = block.find_previous("div", class_="bloko-column_l-2")
            year = year_el.get_text(strip=True) if year_el else None

            title_el = block.select_one('[data-qa="resume-block-education-name"]')
            title = title_el.get_text(strip=True) if title_el else None

            org_el = block.select_one('[data-qa="resume-block-education-organization"]')
            organization = org_el.get_text(" ", strip=True) if org_el else None

            start_date = f"{year}-01" if year else f"{date.today().year}-01"
            end_date = f"{year}-12" if year else f"{date.today().year}-12"

            try:
                additional_education.append(
                    AdditionalEducationItem(
                        title=f"{title} ({organization})", start_date=start_date, end_date=end_date
                    ),
                )
            except Exception:
                pass
        try:
            resume = ResumeParsedResponse(
                role=role,
                skills=skills[: settings.api.resume_skills_max_count],
                education=None,
                experience=experiences[: settings.api.resume_experiences_max_count],
                achievements=None,
                additional_education=additional_education[: settings.api.resume_additional_educations_max_count],
            )
        except Exception:
            return None

        return resume

    async def get_parsed_resume_from_pdf_or_none(self, file: UploadFile) -> ResumeParsedResponse | None:
        text = await asyncio.to_thread(self._parse_text_from_pdf, file)

        if text is None:
            return None

        raw_resume = await self._parse_resume_from_pdf(text)

        if raw_resume is None:
            return None

        raw_skills = list(set(raw_resume.get("skills") or []))[: settings.api.resume_skills_max_count]
        db_skills = await self.resume_repository.create_and_get_skills_by_names(raw_skills)
        skills = [skill.name for skill in db_skills]

        experience = []
        for raw_item in raw_resume.get("experience") or []:
            item = _safe_from_dict(ExperienceItem, raw_item)
            if item is not None:
                experience.append(item)

        achievements = []
        for raw_item in raw_resume.get("achievements") or []:
            item = _safe_from_dict(AchievementItem, raw_item)
            if item is not None:
                achievements.append(item)

        additional_education = []
        for raw_item in raw_resume.get("additional_education") or []:
            item = _safe_from_dict(AdditionalEducationItem, raw_item)
            if item is not None:
                additional_education.append(item)

        resume = ResumeParsedResponse(
            role=_safe(ResumeItemTitle, raw_resume.get("role")),
            skills=skills[: settings.api.resume_skills_max_count],
            education=None,
            experience=experience[: settings.api.resume_experiences_max_count],
            achievements=achievements[: settings.api.resume_achievements_max_count],
            additional_education=additional_education[: settings.api.resume_additional_educations_max_count],
        )

        return resume

    async def _parse_resume_from_pdf(self, text: str) -> Any | None:
        try:
            completion = await client.chat.completions.create(
                model=settings.api.llm_model,
                messages=[dict(role="system", content=system_prompt), dict(role="user", content=user_prompt % text)],
            )
        except Exception:
            return None
        json_text_match = re.search(text_pattern, completion.choices[0].message.content)  # type: ignore
        if json_text_match:
            json_text = json_text_match.group(0)
            try:
                return json.loads(json_text)
            except json.JSONDecodeError:
                return None
        else:
            return None

    def _parse_text_from_pdf(self, file: UploadFile) -> str | None:
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    async def _parse_resume_from_github(
        self, args: ResumeParseFromGithubRequest
    ) -> GitHubResponseModel[list[GitHubRepositoryModel]] | None:
        async with GitHubAPI() as gh_api:
            try:
                if match := re.search(string=args.url, pattern=settings.api.resume_github_link_pattern):
                    username = match.group(1)
                else:
                    username = args.url.split("/")[3]
                return await gh_api.users.repos(username)
            except Exception:
                return None

    async def _parse_resume_from_hh(self, args: ResumeParseFromHeadHunterRequest) -> str | None:
        headers = {"user-agent": Faker().user_agent()}
        ssl_context = ssl.create_default_context(cafile=certifi.where())

        async with aiohttp.ClientSession() as session:
            response = await session.get(url=args.url, headers=headers, ssl_context=ssl_context)  # type: ignore
            if response.status != 200:
                return None

            text = await response.text()
            return text

    def _to_date_iso8601_from_github_format(self, date_str: str) -> str:
        d = date.fromisoformat(date_str.split("T")[0])
        return f"{d.year}-{str(d.month).zfill(2)}"

    def _month_to_num(self, word: str) -> str | None:
        if not word:
            return None
        w = word.strip().lower()
        return self.MONTH_PREFIX.get(w)

    def _find_dates_near(self, elem: Tag, look_limit: int = 60) -> tuple[str | None, str | None]:
        """
        Ищет ближайший текст с датой около элемента elem:
        сначала вверх (previous), затем вниз (next).
        Возвращает tuple (start_yyyy-mm, end_yyyy-mm_or_None)
        """
        candidate = None
        for tag in elem.find_all_previous(limit=look_limit):
            txt = tag.get_text(" ", strip=True)
            if not txt:
                continue
            if self.date_pattern.search(txt) or self.present_pattern.search(txt):
                candidate = txt
                break
        if not candidate:
            for tag in elem.find_all_next(limit=look_limit):
                txt = tag.get_text(" ", strip=True)
                if not txt:
                    continue
                if self.date_pattern.search(txt) or self.present_pattern.search(txt):
                    candidate = txt
                    break

        if not candidate:
            return None, None

        if self.present_pattern.search(candidate):
            m = self.date_pattern.search(candidate)
            if m:
                start_month, start_year, end_month, end_year = m.groups()
                sm = self._month_to_num(start_month)
                start = f"{start_year}-{sm}" if sm else f"{start_year}-01"
                return start, None
            else:
                return None, None

        m = self.date_pattern.search(candidate)
        if not m:
            return None, None

        start_month, start_year, end_month, end_year = m.groups()
        sm = self._month_to_num(start_month)
        em = self._month_to_num(end_month)

        if not end_year:
            end_year = start_year

        start_date = f"{start_year}-{sm}" if sm else f"{start_year}-01"
        end_date = f"{end_year}-{em}" if em else f"{end_year}-01"

        return start_date, end_date


def _safe(cls: Any, value: Any) -> Any:
    try:
        return cls(value)
    except Exception:
        return None


def _safe_from_dict(cls: Any, value: dict[Any, Any]) -> Any:
    try:
        return cls(**value)
    except Exception:
        return None


ResumeParseServiceDepends = Annotated[ResumeParseService, Depends(ResumeParseService)]
