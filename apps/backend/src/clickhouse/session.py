from clickhouse_sqlalchemy import make_session  # type: ignore

from src.clickhouse.engine import ChENGINE

CH_SessionLocal = make_session(engine=ChENGINE)
