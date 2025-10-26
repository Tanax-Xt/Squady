__all__ = [
    "PostgresSettings",
]

from pydantic import BaseModel, PostgresDsn, computed_field


class PostgresSettings(BaseModel):
    scheme: str
    username: str
    password: str
    port: int
    host: str
    path: str
    pool_size: int
    max_overflow: int

    @computed_field  # type: ignore[prop-decorator]
    @property
    def uri(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme=self.scheme,
            username=self.username,
            password=self.password,
            host=self.host,
            port=self.port,
            path=self.path,
        )
