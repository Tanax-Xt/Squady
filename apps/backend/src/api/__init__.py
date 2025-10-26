__all__ = [
    "router",
]

from fastapi import APIRouter

from src.api import auth, users

router = APIRouter()

router.include_router(auth.router)
router.include_router(users.router)
