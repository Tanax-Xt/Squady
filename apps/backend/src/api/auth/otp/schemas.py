from datetime import datetime

from src.api.schemas import BaseSchema


class OTPResponse(BaseSchema):
    """Represents a response containing One-Time Password (OTP) expiration datetime."""

    expires_at: datetime
