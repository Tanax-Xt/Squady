from fastapi import APIRouter, status

from src.api.auth.otp.mailings import OtpMailingServiceDepends
from src.api.auth.otp.schemas import OTPResponse
from src.api.users.me.deps import CurrentUserDepends
from src.headers.timezone import TimeZoneInfo

router = APIRouter(prefix="/otp")


@router.post(
    "/send",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: dict(
            description="Code successfully sent",
        ),
        status.HTTP_401_UNAUTHORIZED: dict(
            description="Not authenticated",
        ),
    },
)
async def send_otp(
    mail_service: OtpMailingServiceDepends, current_user: CurrentUserDepends, tz: TimeZoneInfo
) -> OTPResponse:
    expires_at = await mail_service.send_verification_message(current_user.email, tz)
    return OTPResponse(expires_at=expires_at)
