# Руководство по разработке

**Это руководство по общей разработке, которое не затрагивает бэкенд, фронтенд или развёртывание.**

Если вас интересуют другие компоненты проекта, то изучите следующую документацию:

- [Руководство по разработке бэкенда](../apps/backend/docs/CONTRIBUTING.md).
- [Руководство по разработке фронтенда](../apps/frontend/docs/CONTRIBUTING.md).
- [Руководство по развёртыванию](./DEPLOYMENT.md).

## Начало работы

0. Убедитесь, что у вас установлен [docker](https://www.docker.com/) c [docker compose](https://docs.docker.com/compose/) и вы находитесь на одной из поддерживаемых ОС для разработки этого проекта:

   - **Windows** с настроенным [WSL](https://learn.microsoft.com/ru-ru/windows/wsl/install) (Windows Subsystem for Linux).
   - **macOS**
   - **Linux**

1. Склонируйте этот репозиторий:

   ```sh
   git clone git@github.com:Tanax-Xt/Squady.git
   cd squady
   ```

2. Скопируйте пример конфигурации окружения:

   ```sh
   cp .env.example .env
   ```

3. Заполните и настройте ваш `.env`.

   Вот несколько полезных ссылок, которые вам могут пригодиться в этом процессе:

   - **Telegram [@BotFather](https://t.me/BotFather)**: используется для получения `ALERTMANAGER_TELEGRAM_BOT_TOKEN`.
   - **Telegram [@getmyid_bot](https://t.me/getmyid_bot)**: используется для получения `ALERTMANAGER_TELEGRAM_CHAT_ID`.
   - **[Ethereal Email](https://ethereal.email)**: Удобный сервис для тестирования SMTP, используется для получения `SQUADY_EMAIL_USERNAME`, `SQUADY_EMAIL_PASSWORD`, `SQUADY_EMAIL_PORT`, `SQUADY_EMAIL_SERVER` и других связанных переменных.

## Управление сервисами и общие команды

### Разработка

#### Запуск в режиме разработки со сборкой

```sh
docker compose --profile dev up --build
```

#### Очистка с удалением volumes

```sh
docker compose --profile dev down -v
```

### Локальный пред-продакшен

#### Запуск в пред-продакшене

```sh
docker compose --profile staging up --build
```

#### Очистка с удалением volumes

```sh
docker compose --profile staging down -v
```

### Тестирование (e2e + unit)

#### Запуск всех тестов с автоматическим выходом после завершения

```sh
docker compose --profile test up --build --abort-on-container-exit
```

#### Очистка после всех тестов с удалением volumes

```sh
docker compose --profile test down -v
```

### End-to-End тесты (e2e)

#### Запуск e2e тестов с автоматическим выходом после завершения

```sh
docker compose --profile test-e2e up --build --abort-on-container-exit
```

#### Очистка после e2e тестов с удалением volumes

```sh
docker compose --profile test-e2e down -v
```

### Юнит-тесты (unit)

#### Запуск unit тестов с автоматическим выходом после завершения

```sh
docker compose --profile test-unit up --build --abort-on-container-exit
```

#### Очистка после unit тестов с удалением volumes

```sh
docker compose --profile test-unit down -v
```
