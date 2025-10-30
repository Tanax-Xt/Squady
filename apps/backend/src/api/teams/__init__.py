__all__ = [
    "router",
]

from src.api.teams import application
from src.api.teams.routes import router

router.include_router(application.router)
