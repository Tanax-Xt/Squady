__all__ = [
    "SwaggerSettings",
]

from functools import cached_property
from typing import Any

from pydantic import BaseModel, computed_field


class SwaggerSettings(BaseModel):
    persist_authorization: bool

    @computed_field  # type: ignore[prop-decorator]
    @cached_property
    def parameters(self) -> dict[str, Any]:
        return {
            "persistAuthorization": self.persist_authorization,
        }
