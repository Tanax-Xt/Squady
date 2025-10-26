from datetime import timedelta
from random import randint
from typing import Annotated

from fastapi import Depends
from redis.typing import KeyT, ResponseT

from src.cache import RedisDepends, separate
from src.settings import settings


class OtpService:
    def __init__(self, redis: RedisDepends):
        self.redis = redis

    async def set_otp(self, subject: KeyT) -> int:
        name = self.generate_otp_cache_name(subject)
        otp = self.generate_random_otp()
        expires_at = timedelta(minutes=settings.otp.expire_minutes)

        await self.redis.set(name, otp, expires_at)

        return otp

    async def get_otp(self, subject: KeyT) -> ResponseT:
        name = self.generate_otp_cache_name(subject)
        otp = await self.redis.get(name)

        return otp

    async def expire_otp(self, subject: KeyT) -> ResponseT:
        name = self.generate_otp_cache_name(subject)
        response = await self.redis.delete(name)

        return response

    async def expire_otp_if_correct(self, subject: KeyT, otp: int) -> bool:
        is_correct = await self.is_otp_correct(subject, otp)
        if is_correct:
            await self.expire_otp(subject)
        return is_correct

    async def is_otp_correct(self, subject: KeyT, otp: int) -> bool:
        return await self.get_otp(subject) == str(otp).encode()

    @staticmethod
    def generate_random_otp() -> int:
        return randint(int("0" * settings.otp.length), int("9" * settings.otp.length))

    @staticmethod
    def generate_otp_cache_name(subject: KeyT) -> str:
        return separate(settings.otp.prefix, subject)


OtpServiceDepends = Annotated[OtpService, Depends(OtpService)]
