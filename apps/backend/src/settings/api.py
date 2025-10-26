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
