import logging

from src.api.resumes.parse.models import ResumeParseLog
from src.clickhouse import ChENGINE

_logger = logging.getLogger(__name__)


def main() -> None:
    ResumeParseLog.__table__.create(bind=ChENGINE, checkfirst=True)
    _logger.info("ClickHouse tables created")


if __name__ == "__main__":
    main()
