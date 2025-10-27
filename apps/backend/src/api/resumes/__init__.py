__all__ = [
    "router",
]

from src.api.resumes import parse
from src.api.resumes.routes import router

router.include_router(parse.router)
