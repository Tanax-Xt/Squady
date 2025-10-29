__all__ = [
    "router",
]

from fastapi import APIRouter

from src.api import auth, resumes, teams, users

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(resumes.router)
router.include_router(teams.router)
