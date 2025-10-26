__all__ = [
    "SMTPSettings",
]

from fastapi_mail import ConnectionConfig
from pydantic import BaseModel, computed_field


class SMTPSettings(BaseModel):
    username: str
    password: str
    port: int
    server: str
    starttls: bool
    ssl_tls: bool
    from_name: str
    use_credentials: bool
    validate_certs: bool
    template_path: str = "./src"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def config(self) -> ConnectionConfig:
        return ConnectionConfig(
            MAIL_USERNAME=self.username,
            MAIL_PASSWORD=self.password,
            MAIL_PORT=self.port,
            MAIL_SERVER=self.server,
            MAIL_STARTTLS=self.starttls,
            MAIL_SSL_TLS=self.ssl_tls,
            MAIL_FROM=self.username,
            MAIL_FROM_NAME=self.from_name,
            USE_CREDENTIALS=self.use_credentials,
            VALIDATE_CERTS=self.validate_certs,
        )
