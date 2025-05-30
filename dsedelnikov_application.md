# Данила Седельников - "Squady"

### Группа: 10 - И - 2
### Электронная почта: [ddsedelnikov@edu.hse.ru](mailto:ddsedelnikov@edu.hse.ru)
### Tg: [@forever_molodoy](https://t.me/forever_molodoy)

<br>

**[ НАЗВАНИЕ ПРОЕКТА ]**

**“Squady”** — _каждый найдет свою команду_

**[ ПРОБЛЕМНОЕ ПОЛЕ ]**

Количество интеллектуальных командных соревнований с каждым годом увеличивается, что приводит к необходимости развития способов поиска команды и нетворкинга для "одиночек". Также существуют проекты, которые напрямую не относятся к интеллектуальным соревнованиям, но подразумевают под собой командное участие.

[//]: # (<br>)

К сервисам и приложениям, предоставляющим подобный функционал, предъявляются следующие требования:
1) Ориентация на ЦА
2) Фильтрация по событиям
3) Фильтрация по компетенциям участников
4) Доступность с любого устройства

Однако, во всех имеющихся программных продуктах **отсутствует**, по нашим данным:
1) Ориентация на школьников (данный критерий подразумевает под собой то, что существующие сервисы не ориентированы на школьников, которые участвуют в образовательных мероприятиях, а представлены для более старших пользователей, основной запрос которых — поиск работы)
2) Интеграция с проходящими мероприятиями (предосталение возможности организаторам образовательно-соревновательных мероприятий использовать Squady, как основную площадку командообразования)
3) Удобный функционал для формирования команд


**[ ЗАКАЗЧИК / ПОТЕНЦИАЛЬНАЯ АУДИТОРИЯ ]**

Программный продукт может заинтересовать широкую аудиторию, поскольку рассчитан на подбор различных команд, однако необходимо выделить несколько групп пользователей, на которые будет сделан акцент. К выделяемым группам относятся:

* Учащиеся средней и старшей школы, заинтересованные в участии в командных олимпиадах
* Учащиеся вузов, заинтересованные в участии в командных мероприятиях, например, хакатонах и т. п.
* Учащиеся Лицей НИУ ВШЭ заинтересованные в развитии собственных СПД-проектов

Также, продукт может заинтересовать организаторов командных олимпиад, например, ДАНО и ПРОД. Поскольку, ежегодно на данных олимпиадах участники вынуждены искать команду в чате, а около 20% участников распределяется по командам случайно, что может отрицательно сказываться на результатах участников


**[ АППАРАТНЫЕ / ПРОГРАММНЫЕ ТРЕБОВАНИЯ ]** 

Продукт разрабатывается под все известные операционные системы в данный момент в виде веб-версии для следующей конфигурации:
* Облачная версия: браузеры Chrome, Firefox, Safari


**[ ФУНКЦИОНАЛЬНЫЕ ТРЕБОВАНИЯ ]**

Программный продукт будет предоставлять следующие возможности:
* Регистрация/авторизация пользователей
* Выбор профилей: участник, наставник, представитель олимпиады, админ
* Выбор ролей: лидер команды/участник команды
* Создание резюме
* Парсинг резюме пользователя из разничных ресурсов (GitHub, LinkedIn, HH.RU, PDF-file)
* Управление профилем команды для тимлидов и наставников
* Отправка приглашений/заявок в команду, их одобрение
* Подбор резюме по параметрам для тимлидов
* Подбор команд по параметрам для соискателей
* Фильтрация по событиям
* Статистика по заявкам в команду (дополнительный функционал)
* Парсинг сайта со списком интеллектуальных соревнований для выдачи рекомендации пользователям о том, в каких ближайших мероприятиях они могут участвовать, на основе анализа их резюме. (Возможно предлагать олимпиады из перечня РСОШ, поскольку нет единого перечня командных олимпиад) (дополнительный функционал)


**[ ПОХОЖИЕ / АНАЛОГИЧНЫЕ ПРОДУКТЫ ]**

Анализ схожих по задачам инструментов, показал, что не существует решения для поиска команд для участия в командных соревнованиях. Существуют только чаты по интересам в Tg, которые не позволяют структурировано представлять информацию, а профили пользователей не информативны

**[ ИНСТРУМЕНТЫ РАЗРАБОТКИ, ИНФОРМАЦИЯ О БД ]**
*	Figma - дизайн и макеты интерфейса
*   Django / HTML / CSS / JS - для разработки веб-версии
*   SQLAlchemy - orm для работы с БД, используется, как одна из наиболее распространенных ORM
*	PostgreSQL / Redis - для хранения данных. PostgreSQL - гибкая, быстрая, позволяет работать с большим объемом данных (для потенциального роста). Redis - хранение и быстрый доступ к кратковременной информации, например, кодов авторизации

**[ ЭТАПЫ РАЗРАБОТКИ ]**

*	Разработка пользовательских сценариев
*	Проектирование интерфейса
*   Проектирование БД
*	Реализация API
*	Реализация интерфейса
*	Запуск продукта
*	Тестирование, отладка
*	Подготовка проекта к защите

**[ ВОЗМОЖНЫЕ РИСКИ ]**

*	Невозможность спроектировать удобный пользовательский интерфейс
*	Необходимость изучения дополнительных технологий в области фронтенда для реализации проекта
*   Сложность технической реализации парсинга резюме пользователя из разничных ресурсов (GitHub, LinkedIn, HH.RU, PDF-file)
*   Парсинг олимпиад и алгоритм их ранжирования для пользователей
