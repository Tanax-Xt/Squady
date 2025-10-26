[![Docker Version](https://img.shields.io/docker/v/tanaxxt/squady-backend/latest?logo=docker)](https://hub.docker.com/r/tanaxxt/squady-backend)
[![Docker Image Size](https://img.shields.io/docker/image-size/tanaxxt/squady-backend/latest?logo=docker)](https://hub.docker.com/r/tanaxxt/squady-backend)
[![Docker Pulls](https://img.shields.io/docker/pulls/tanaxxt/squady-backend?logo=docker)](https://hub.docker.com/r/tanaxxt/squady-backend)

[![Python Version](https://img.shields.io/badge/3.13-007EC6?label=python&logo=python)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-1F5082?label=%20&logo=fastapi&labelColor=gray&color=009485)](https://fastapi.tiangolo.com)
[![mypy](https://img.shields.io/badge/mypy-2A6DB2?logo=python&labelColor=gray)](https://github.com/python/mypy)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)
[![pycodestyle](https://img.shields.io/badge/pycodestyle-000000?label=style)](https://pycodestyle.pycqa.org)

# Бэкенд

FastAPI-сервис, реализованный как модульный монолит.

## Технические детали

### Основные технологии

- [Python](https://www.python.org) 3.13+
- [FastAPI](https://fastapi.tiangolo.com) (веб-фреймворк).
- [Pydantic](https://pydantic.dev) v2 (валидация данных) + [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) (конфигурация).
- [PostgreSQL](https://www.postgresql.org) (через [SQLAlchemy](https://www.sqlalchemy.org) 2.0 + [asyncpg](https://magicstack.github.io/asyncpg)).
- [Docker](https://www.docker.com/) и [Docker Compose](https://docs.docker.com/compose/) (контейнеризация).

### Инструменты разработки

- [mypy](https://github.com/python/mypy) — строгая статическая типизация.
- [ruff](https://github.com/astral-sh/ruff) — линтер и форматтер.
- [pytest](https://pytest.org) — тестирование.
- [pip](https://github.com/pypa/pip) — управление зависимостями.

Чтобы более подробно ознакомиться с зависимостями, изучите директорию [requirements](./requirements/).

## Архитектура

Для детального обзора архитектуры этого сервиса ознакомьтесь с [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Участие в разработке

Если вы хотите сделать свой вклад в развитие этого сервиса, то ознакомьтесь с [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## Создание супер-пользователя

Для создания супер-пользователя используется специальный скрипт:

```sh
docker exec -it squady-backend-dev python -m cli superuser create
```
