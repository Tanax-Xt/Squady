__all__ = [
    "create_access_token",
    "is_valid_password",
    "get_password_hash",
]

import asyncio
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from passlib.context import CryptContext

from src.api.auth.schemas import JWT, AccessTokenResponse
from src.settings import settings

crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: Any, minutes: int = settings.security.jwt_expire_minutes) -> AccessTokenResponse:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    to_encode = JWT(exp=expires_at, sub=str(subject))
    access_token = jwt.encode(
        to_encode.model_dump(), settings.security.jwt_secret, algorithm=settings.security.jwt_algorithm
    )
    return AccessTokenResponse(access_token=str(access_token), expires_at=expires_at)


def is_valid_password(plain_password: str, hashed_password: str) -> bool:
    return crypt_context.verify(plain_password, hashed_password)


async def get_password_hash(password: str) -> str:
    return await asyncio.to_thread(crypt_context.hash, password)
