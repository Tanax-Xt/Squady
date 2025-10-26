__all__ = [
    "router",
]

from src.api.auth import otp
from src.api.auth.routes import router

router.include_router(otp.router)
