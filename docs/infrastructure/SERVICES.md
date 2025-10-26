# Описание compose профилей и сервисов

Этот файл описывает для чего нужен тот или иной сервис.

Чтобы посмотреть типовые сценарии использования, прочитайте общее [руководство по разработке](../CONTRIBUTING.md) или [руководство по развёртыванию](../DEPLOYMENT.md).

## Профили

- `dev` — основной профиль для разработки, включает:

  - `backend-dev` (с автоматической перезагрузкой при изменениях)
  - `frontend-dev` (с HMR)
  - `postgres`
  - `redis`
  - `nginx-dev` (80/443)

- `dev-backend` — профиль только для разработки бэкенда, включает:

  - `backend-dev` (с автоматической перезагрузкой при изменениях)
  - `postgres`
  - `redis`

- `prod` — продуктовое окружение, включает:

  - `backend`
  - `frontend`
  - `postgres`
  - `redis`
  - `nginx` (80/443)
  - `node-exporter`
  - `prometheus`
  - `alertmanager`
  - `grafana`

- `staging` — локальное пред-продуктовое окружение, включает:

  - `backend-staging`
  - `frontend-staging`
  - `postgres`
  - `redis`
  - `nginx-staging` (80/443)

- `test` — полный набор тестов, включает:

  - `backend-test-e2e`
  - `backend-test-unit`
  - `postgres-test`

- `test-e2e` — профиль для end-to-end тестирования, включает:

  - `backend-test-e2e`
  - `postgres-test`

- `test-unit` — профиль для юнит-тестов, включает:

  - `backend-test-unit`
  - `postgres-test`

## Сервисы

- `backend` — продакшен версия бэкенда.
- `backend-dev` — версия бэкенда для разработки с автоматической перезагрузкой при изменениях, доступная на http://127.0.0.1:8000.
- `backend-staging` — локальная пред-продакшен версия бэкенда.
- `backend-test` — запуск всех тестов бэкенда.
- `backend-test-e2e` — запуск только e2e тестов бэкенда.
- `backend-test-unit` — запуск только unit тестов бэкенда.
- `frontend` — продакшен версия фронтенда.
- `frontend-staging` — локальная пред-продакшен версия фронтенда.
- `frontend-dev` — версия фронтенда для разработки с HMR.
- `postgres` — база данных (общая для `dev`, `staging` и `prod`)
- `postgres-test` — база данных (общая `test`, `test-e2e` и `test-unit`)
- `redis` — кеш (общий для `dev`, `staging` и `prod`)
- `node-exporter` — cбор метрик для prometheus'а.
- `prometheus` — мониторинг и алерты, доступный на http://127.0.0.1:9090.
- `alertmanager` — обработка алертов.
- `grafana` — визуализация метрик.
- `nginx` — продакшен прокси (80/443).
- `nginx-staging` — локальный пред-продакшен прокси (80/443).
- `nginx-dev` — прокси для локальной разработки (80/443).
