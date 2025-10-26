__all__ = [
    "router",
]

from src.api.users.me import personal
from src.api.users.me.routes import router

router.include_router(personal.router)
