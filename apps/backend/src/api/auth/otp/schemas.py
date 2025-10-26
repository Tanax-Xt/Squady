from datetime import datetime

from pydantic import BaseModel


class OTPResponse(BaseModel):
    """Represents a response containing One-Time Password (OTP) expiration datetime."""

    expires_at: datetime
