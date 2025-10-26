__all__ = [
    "User",
]

from logging.config import dictConfig

from src.api.users.models import User
from src.settings import settings

dictConfig(settings.logging)
