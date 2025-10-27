__all__ = [
    "User",
    "Resume",
    "Role",
    "Skill",
]

from logging.config import dictConfig

from src.api.resumes.models import Resume, Role, Skill
from src.api.users.models import User
from src.settings import settings

dictConfig(settings.logging)
