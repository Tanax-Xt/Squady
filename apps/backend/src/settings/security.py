__all__ = [
    "SecuritySettings",
]

from pydantic import BaseModel, PositiveInt


class SecuritySettings(BaseModel):
    jwt_algorithm: str
    jwt_expire_minutes: PositiveInt
    jwt_secret: str
