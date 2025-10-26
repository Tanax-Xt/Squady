import hashlib

from src.api.users.models import User
from src.settings import settings
from tests.utils.string import generate_str


def generate_user(username: str | None = None, password: str | None = None, email: str | None = None) -> User:
    user = User()

    user.username = username or generate_username()
    user.password = password or generate_password()
    user.email = email or generate_email()

    return user


def generate_username() -> str:
    return generate_str(
        min_length=settings.api.user_username_min_length,
        max_length=settings.api.user_username_max_length,
        pattern=settings.api.user_username_pattern,
    )


def generate_password() -> str:
    return generate_str(
        min_length=settings.api.user_password_min_length,
        max_length=settings.api.user_password_max_length,
        pattern=settings.api.user_password_pattern,
    )


def generate_email(domain: str = "example.com") -> str:
    username = generate_username()
    return f"{username}@{domain}"


def generate_password_hash() -> str:
    return str(hashlib.sha256())
