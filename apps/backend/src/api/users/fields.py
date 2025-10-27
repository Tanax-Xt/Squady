from datetime import date
from typing import Annotated

from pydantic import AfterValidator, EmailStr, Field, StringConstraints

from src.api.users.validators import validate_birth_date_in_range
from src.settings import settings

UserUsername = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        min_length=settings.api.user_username_min_length,
        max_length=settings.api.user_username_max_length,
        pattern=settings.api.user_username_pattern,
    ),
    Field(
        examples=["username"],
    ),
]

UserEmail = Annotated[
    EmailStr,
    Field(
        title="User email",
        examples=["johndoe@example.com"],
    ),
]

UserPassword = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        min_length=settings.api.user_password_min_length,
        max_length=settings.api.user_password_max_length,
        pattern=settings.api.user_password_pattern,
    ),
    Field(
        examples=["password"],
    ),
]

UserTelegram = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        pattern=settings.api.user_telegram_pattern,
    ),
    Field(
        title="Telegram username",
        description="Telegram username 5–32 characters long.",
        examples=["johndoe"],
    ),
]

UserFullName = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        pattern=settings.api.user_full_name_pattern,
    ),
    Field(
        title="User full name",
        description="User's full name, consisting of 2 or 3 words with only alphabetic characters, no abbreviations.",
        examples=["John Doe", "Jane Smith Johnson", "Alice B Toklas"],
    ),
]

UserBirthDate = Annotated[
    date,
    Field(
        title="User birth date",
        description=f"User's birth date, must be between {settings.api.user_birth_date_min_years} and {settings.api.user_birth_date_max_years} years old.",  # noqa: E501
        examples=["2000-01-01"],
    ),
    AfterValidator(validate_birth_date_in_range),
]

UserAbout = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.user_about_max_length,
    ),
    Field(
        title="User about",
        description="A brief description about the user.",
        examples=["Software developer with a passion for open-source projects."],
    ),
]

UserCity = Annotated[
    str,
    StringConstraints(
        strict=True,
        strip_whitespace=True,
        max_length=settings.api.user_city_max_length,
    ),
    Field(
        title="User city",
        description="User's locality",
        examples=["Moscow", "Saint Petersburg"],
    ),
]
