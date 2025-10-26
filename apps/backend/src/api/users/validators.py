from datetime import date

from src.settings import settings


def validate_birth_date_in_range(value: date) -> date:
    today = date.today()
    after = today.replace(year=today.year - settings.api.user_birth_date_max_years)
    before = today.replace(year=today.year - settings.api.user_birth_date_min_years)

    if before < value or value < after:
        raise ValueError(f"Birth date must be between {after} and {before}.")

    return value
