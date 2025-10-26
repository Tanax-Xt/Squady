__all__ = [
    "OTPSettings",
]

from pydantic import BaseModel, PositiveInt


class OTPSettings(BaseModel):
    length: int = 6
    expire_minutes: PositiveInt
    prefix: str = "otp"
