__all__ = [
    "ClickHouseSettings",
]

from pydantic import BaseModel, ClickHouseDsn, computed_field


class ClickHouseSettings(BaseModel):
    scheme: str
    username: str
    password: str
    port: int
    host: str
    path: str

    @computed_field  # type: ignore[prop-decorator]
    @property
    def uri(self) -> ClickHouseDsn:
        return ClickHouseDsn.build(
            scheme=self.scheme,
            username=self.username,
            password=self.password,
            host=self.host,
            port=self.port,
            path=self.path,
        )
