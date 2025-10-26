from datetime import datetime, timedelta, timezone, tzinfo
from typing import Annotated

from fastapi import Depends
from fastapi_mail import MessageSchema, MessageType

from src.api.auth.otp.service import OtpServiceDepends
from src.mail import fm
from src.settings import settings
from src.template import render


class OtpMailingService:
    def __init__(self, service: OtpServiceDepends):
        self.service = service

    async def send_verification_message(self, recipient: str, tz: tzinfo) -> datetime:
        otp = await self.service.set_otp(recipient)
        expires_at = self.generate_code_expiration_timestamp(tz)
        message = self.generate_verification_message(recipient, otp, expires_at)

        await fm.send_message(message)

        return expires_at

    @staticmethod
    def generate_code_expiration_timestamp(tz: tzinfo = timezone.utc) -> datetime:
        return datetime.now(tz) + timedelta(minutes=settings.otp.expire_minutes)

    @staticmethod
    def generate_verification_message(recipient: str, otp: int, expires_at: datetime) -> MessageSchema:
        subject = "Верификация"

        context = dict(
            otp=str(otp).zfill(settings.otp.length),
            expires_at=expires_at,
        )

        body = render("otp.jinja", context)

        return MessageSchema(recipients=[recipient], subject=subject, body=body, subtype=MessageType.html)


OtpMailingServiceDepends = Annotated[OtpMailingService, Depends(OtpMailingService)]
