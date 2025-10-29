__all__ = [
    "ApiSettings",
]

from re import Pattern

from pydantic import BaseModel, NonNegativeInt, PositiveInt


class ApiSettings(BaseModel):
    token_url: str = "auth/login"

    pagination_search_params_max_limit: PositiveInt

    user_username_min_length: PositiveInt
    user_username_max_length: PositiveInt
    user_username_pattern: Pattern[str]
    user_password_min_length: PositiveInt
    user_password_max_length: PositiveInt
    user_password_pattern: Pattern[str]
    user_full_name_pattern: Pattern[str]
    user_birth_date_max_years: PositiveInt
    user_birth_date_min_years: NonNegativeInt
    user_city_max_length: PositiveInt
    user_telegram_pattern: Pattern[str]
    user_about_max_length: PositiveInt

    resume_item_title_max_length: PositiveInt
    resume_skill_max_length: PositiveInt
    resume_skills_min_count: PositiveInt
    resume_skills_max_count: PositiveInt
    resume_experiences_min_count: PositiveInt
    resume_experiences_max_count: PositiveInt
    resume_achievements_min_count: PositiveInt
    resume_achievements_max_count: PositiveInt
    resume_additional_educations_min_count: PositiveInt
    resume_additional_educations_max_count: PositiveInt
    resume_item_date_max_years_ago: PositiveInt
    resume_item_date_max_years_future: PositiveInt
    resume_date_iso8601_pattern: Pattern[str]
    resume_github_link_pattern: Pattern[str]
    resume_hh_link_pattern: Pattern[str]
    resume_max_pdf_size: PositiveInt

    team_title_max_length: PositiveInt
    team_text_field_max_length: PositiveInt

    openrouter_api_key: str
    llm_model: str
