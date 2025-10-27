from sqlalchemy import create_engine

from src.settings import settings

ChENGINE = create_engine(str(settings.clickhouse.uri))  # : Final[AsyncEngine]
