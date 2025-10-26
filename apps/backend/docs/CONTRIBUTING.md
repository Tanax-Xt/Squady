# Руководство по разработке бэкенда

**Это руководство именно по разработке бэкенда, которое не затрагивает общие принципы, фронтенд или развёртывание.**

Подразумевается, что вы уже прочитали общее [руководство по разработке](../../../docs/CONTRIBUTING.md).

## Начало работы

0. Убедитесь, что у вас установлен Python 3.13 или выше.

1. Перейдите в директорию [`apps/backend`](../).

   ```sh
   cd apps/backend
   ```

2. Создайте и активируйте виртуальное окружение:

   ```sh
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Установите необходимые зависимости для разработки:

   ```sh
   pip install -r requirements/dev.txt
   ```

   Если вы тестировщик, то вам потребуется дополнительно установить зависимости для тестирования:

   ```sh
   pip install -r requirements/test.txt
   ```

4. Установите [pre-commit](https://pre-commit.com/) git хуки для соблюдения код-стайла:

   ```sh
   pre-commit install
   ```

   Вы также можете проверить код-стайл без `git commit`, используя следующую команду:

   ```sh
   pre-commit
   ```

> [!NOTE]
> Избежать `pre-commit` при `git commit` можно с помщью аргумента [--no-verify](https://git-scm.com/docs/githooks#_pre_commit).

## Управление сервисами и общие команды

### Запуск проекта в режиме разработки:

Команда ниже запустит только контейнеры `backend-dev` и `postgres` без `nginx-dev`:

```sh
docker compose --profile dev-backend up --build
```

> [!TIP]
> Чтобы открыть документацию Swagger, перейдите по адресу http://127.0.0.1:8000/docs.

### Очистка с удалением volumes

```sh
docker compose --profile dev-backend down -v
```

### Создание миграций и взаимодействие с alembic

0. Убедитесь, что вы находитесь в директории `apps/backend` и ваше виртуальное окружение активно.

   ```sh
   cd apps/backend
   source .venv/bin/activate
   ```

1. Запустите контейнер с базой данных в фоновом режиме:

   ```sh
   docker compose up postgres -d --remove-orphans
   ```

2. Обновите базу данных до последей версии:

   ```sh
   SQUADY_POSTGRES_HOST="localhost" alembic upgrade head
   ```

3. Сделайте миграцию или выполните иные необходимые команды:

   ```sh
   SQUADY_POSTGRES_HOST="localhost" alembic revision --autogenerate -m "message"
   ```

> [!NOTE]
> Переопределение переменной `SQUADY_POSTGRES_HOST` важно, чтобы иметь возможность
> использовать команды `alembic` вне docker.

> [!TIP]
> Если вы часто работаете с `alembic`, то вы можете временно поменять переменную
> `SQUADY_POSTGRES_HOST` в [`.env`](../../../.env) с `"postgres"` на `"localhost"`,
> чтобы каждый раз не добавлять `SQUADY_POSTGRES_HOST="localhost"` перед командами.

4. Остановите и очистите контейнер с базой данных после всех действий:

   ```sh
   docker compose down postgres -v --remove-orphans
   ```
