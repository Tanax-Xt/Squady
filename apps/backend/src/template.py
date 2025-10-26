__all__ = ["env", "render"]

import os
from typing import Any

from jinja2 import Environment, FileSystemLoader, Template

from src.settings import settings

DIRNAME = "templates"


def get_template_dirs() -> list[str]:
    return [os.path.join(root, DIRNAME) for root, dirs, _ in os.walk(settings.email.template_path) if DIRNAME in dirs]


env = Environment(
    auto_reload=settings.app.debug,
    loader=FileSystemLoader(get_template_dirs()),
)


def render(name: str | Template, *args: Any, **kwargs: Any) -> str:
    _set_extra_kwargs(kwargs)
    template = env.get_template(name)
    return template.render(*args, **kwargs)


def _set_extra_kwargs(kwargs: Any) -> None:
    kwargs["organization"] = settings.app.title
