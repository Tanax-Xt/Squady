from datetime import date

from src.settings import settings


def validate_achievement_year(achievement_year: int) -> int:
    today = date.today().year

    if achievement_year > today:
        raise ValueError("The year of the achievement should be no more than the current year.")

    return achievement_year


def validate_date_iso8601(iso8601_date: str) -> str:
    today = date.today()

    ago = today.replace(year=today.year - settings.api.resume_item_date_max_years_ago)
    future = today.replace(year=today.year + settings.api.resume_item_date_max_years_future)

    user_date = date.fromisoformat(f"{iso8601_date}-28")

    if not (ago <= user_date <= future):
        raise ValueError(
            f"The date should be maximum {settings.api.resume_item_date_max_years_ago} years ago and {settings.api.resume_item_date_max_years_future} years in the future."  # noqa: E501
        )

    return iso8601_date


def validate_education_end_year(education_end_year: int) -> int:
    today = date.today()

    ago = today.replace(year=today.year - settings.api.resume_item_date_max_years_ago).year
    future = today.replace(year=today.year + settings.api.resume_item_date_max_years_future).year

    if not (ago <= education_end_year <= future):
        raise ValueError(
            f"The end year of education should be maximum {settings.api.resume_item_date_max_years_ago} years ago and {settings.api.resume_item_date_max_years_future} years in the future."  # noqa: E501
        )

    return education_end_year
