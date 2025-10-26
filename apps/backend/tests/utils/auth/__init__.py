__all__ = [
    "auth_client",
    "AuthClient",
    "AuthLoginDict",
    "AuthRegisterDict",
]

from tests.utils.auth.args import AuthLoginDict, AuthRegisterDict
from tests.utils.auth.client import AuthClient
from tests.utils.auth.fixtures import auth_client
