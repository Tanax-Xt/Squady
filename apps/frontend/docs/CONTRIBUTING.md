# Руководство по разработке фронтенда

**Это руководство именно по разработке фронтенда, которое не затрагивает общие принципы, бэкенд или развёртывание.**

Подразумевается, что вы уже прочитали общее [руководство по разработке](../../../docs/CONTRIBUTING.md).

## Начало работы

0. Убедитесь, что у вас установлены Node.js 22+ и pnpm 10+.

1. Перейдите в директорию [apps/frontend](../).

   ```sh
   cd apps/frontend
   ```

2. Установите зависимости:

   ```sh
   pnpm install
   ```

> [!NOTE]
> Вместе с этой командой также установятся pre-commit git хуки. Чтобы избежать `pre-commit` при `git commit` можно с помщью аргумента [--no-verify](https://git-scm.com/docs/githooks#_pre_commit).

## Управление сервисами и общие команды

### Запуск проекта в режиме разработки:

Команда ниже запустит только контейнеры `backend-dev`, `frontend-dev`, `postgres` и `nginx-dev`:

```sh
docker compose --profile dev up --build
```

> [!TIP]
> Чтобы открыть приложение, перейдите по адресу http://127.0.0.1. Документация Swagger бэкенда доступна на http://127.0.0.1/api/docs.

### Очистка с удалением volumes

```sh
docker compose --profile dev down -v
```

## Форматирование

- Форматирование всего проекта (Prettier + сортировка package.json):

  ```sh
  pnpm format
  ```

- Проверка форматирования без изменений:

  ```sh
  pnpm format:prettier:check
  ```

- Автоматическое исправление форматирования:

  ```sh
  pnpm format:prettier:write
  ```

- Сортировка и форматирование [package.json](../package.json):

  ```sh
  pnpm format:package
  ```

## Типизация

Для проверки типов используется TypeScript:

```sh
pnpm lint:tsc
```

## Линтинг

Для проверки кода используется строгий линтинг ESLint и Next.js:

```sh
pnpm lint:next
```

## Архитектура проекта

Проект использует методологию [Feature-Sliced Design](./ARCHITECTURE.md).

Для проверки на соответствие архитектуре используйте:

```sh
pnpm lint:steiger
```

## Генерация типов API

Для генерации TypeScript-типов из OpenAPI спецификации бэкенда используется [OpenAPI TypeScript](https://openapi-ts.dev):

Чтобы сгенерировать типы API:

0. [Убедитесь](#запуск-проекта-в-режиме-разработки), что бэкенд запущен.

1. Выполните:

   ```sh
   pnpm generate:api-types
   ```

   Типы будут сохранены в [`src/shared/api/types.ts`](../src/shared/api/types.ts)

> [!NOTE]
> Типы обязательно должны находится под контролем git чтобы работал CI.
