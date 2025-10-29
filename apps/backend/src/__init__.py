__all__ = ["User", "Resume", "Role", "Skill", "Team", "TeamToUser"]

from logging.config import dictConfig

from src.api.resumes.models import Resume, Role, Skill
from src.api.teams.models import Team
from src.api.users.models import TeamToUser, User
from src.settings import settings

dictConfig(settings.logging)
