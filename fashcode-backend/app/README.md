# FashCode Backend API

API для интернет-магазина одежды, разработанное на FastAPI.

## 🚀 Быстрый старт

### Требования
- Python 3.8+
- PostgreSQL
- pip (менеджер пакетов Python)

### Установка

1. **Клонируйте репозиторий**
```bash
git clone <your-repo-url>
cd fashcode-backend

2. # создайте виртуальное окружение
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

3. # Установите зависимости
pip install -r requirements.txt

4. # Настройте базу данных PostgreSQL
# Войдите в PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE fashcode_db;

# Выход
\q

# Импортируйте схему и данные
psql -U postgres -d fashcode_db -f sql/create_tables.sql
psql -U postgres -d fashcode_db -f sql/insert_data.sql

5. # Настройте переменные окружения  Создайте файл .env и заполните его:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fashcode_db
DB_USER=postgres
DB_PASSWORD=ваш_пароль
SECRET_KEY=секретный_ключ_для_jwt

6. # Запустите приложение
uvicorn app.main:app --reload 

7.
* Откройте документацию API
* Перейдите по адресу: http://localhost:8000/docs

СТРУКТУРА ПРОЕКТА

fashcode-backend/
├── app/
│   ├── __init__.py          # Инициализация пакета
│   ├── main.py              # Главный файл приложения
│   ├── database.py          # Настройка подключения к БД
│   ├── models.py            # Модели SQLAlchemy
│   ├── schemas.py           # Pydantic схемы
│   ├── crud.py              # CRUD операции
│   ├── auth.py              # Аутентификация и авторизация
│   ├── routers/             # Роутеры (эндпоинты)
│   │   ├── products.py      # Работа с товарами
│   │   ├── categories.py    # Работа с категориями
│   │   ├── cart.py          # Работа с корзиной
│   │   └── orders.py        # Работа с заказами
│   └── utils/               # Вспомогательные функции
├── sql/
│   ├── create_tables.sql    # SQL для создания таблиц
│   └── insert_data.sql      # SQL для заполнения данными
├── requirements.txt         # Зависимости Python
├── .env                     # Переменные окружения
└── README.md               # Документация


🔑 Тестовые пользователи
 Email	Пароль	Роль
 admin@fashcode.com	admin123	Администратор
 ivan@example.com	admin123	Обычный пользователь
 maria@example.com	admin123	Обычный пользователь
 alex@example.com	admin123	Обычный пользователь
 Примечание: Для всех тестовых пользователей пароль admin123 (в базе хранится хэш этого пароля)


📚 API Эндпоинты
Аутентификация
 POST /api/auth/register - Регистрация нового пользователя
 POST /api/auth/login - Вход и получение JWT токена
 GET /api/auth/me - Получение информации о текущем пользователе

----------------------------------------

Товары
 GET /api/products - Список всех товаров
 GET /api/products/{id} - Информация о товаре
 POST /api/products - Создать товар (только админ)
 PUT /api/products/{id} - Обновить товар (только админ)
 DELETE /api/products/{id} - Удалить товар (только админ)


Категории
 GET /api/categories - Список категорий
 GET /api/categories/{id} - Информация о категории
 POST /api/categories - Создать категорию (только админ)


Корзина
 GET /api/cart - Просмотр корзины
 POST /api/cart/add - Добавить товар в корзину
 PUT /api/cart/update/{product_id} - Изменить количество
 DELETE /api/cart/remove/{product_id} - Удалить из корзины


Заказы
 POST /api/orders/create - Оформить заказ
 GET /api/orders - Список заказов пользователя
 GET /api/orders/{id} - Детали заказа


Отзывы
 POST /api/reviews - Оставить отзыв
 GET /api/products/{product_id}/reviews - Отзывы о товаре

🛠️ Технологии
FastAPI - Веб-фреймворк
 SQLAlchemy - ORM для работы с БД
 PostgreSQL - Реляционная база данных
 Pydantic - Валидация данных
 JWT - Аутентификация
 Bcrypt - Хэширование паролей

🔄 Примеры запросов
 Регистрация 
  curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "newuser",
    "password": "password123",
    "first_name": "Иван",
    "last_name": "Петров"
  }'


Вход
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "admin123"
  }'


Получение товаров (с токеном)
 curl -X GET "http://localhost:8000/api/products" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"


Добавление в корзину
 curl -X POST "http://localhost:8000/api/cart/add" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "uuid_товара",
    "quantity": 2
  }'  '


📝 Примечания
1. Все эндпоинты, кроме регистрации и входа, требуют JWT токен
2. Токен передается в заголовке: Authorization: Bearer <token>
3. Администратор имеет доступ ко всем заказам и может управлять товарами
4. Пароли хэшируются с помощью bcrypt
5. В базе данных уже есть тестовые данные (категории, товары, пользователи)


🐛 Решение проблем
Проблема: Не удается подключиться к базе данных
Решение: Проверьте, запущен ли PostgreSQL, и правильные ли данные в файле .env


Проблема: Ошибка импорта модулей
Решение: Убедитесь, что вы активировали виртуальное окружение и установили зависимости


Проблема: Порт 8000 уже используется
Решение: Запустите приложение на другом порту:
 uvicorn app.main:app --reload --port 8001


📄 Лицензия
MIT License
 
  # Шаг 4: Создание файла с зависимостями

### **requirements.txt**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
bcrypt==4.0.1
python-dotenv==1.0.0


Шаг 5: Запуск проекта
Теперь выполните эти команды в терминале:
# Убедитесь, что вы в папке проекта и виртуальное окружение активировано
cd Desktop/fashcode-backend
venv\Scripts\activate

# Установите зависимости
pip install -r requirements.txt

# Создайте файл .env и отредактируйте его (укажите пароль от PostgreSQL)
echo DB_HOST=localhost > .env
echo DB_PORT=5432 >> .env
echo DB_NAME=fashcode_db >> .env
echo DB_USER=postgres >> .env
echo DB_PASSWORD=your_password >> .env
echo SECRET_KEY=supersecretkey123456789 >> .env

# Импортируйте SQL файлы в PostgreSQL
psql -U postgres -f sql/create_tables.sql
psql -U postgres -f sql/insert_data.sql

# Запустите сервер
uvicorn app.main:app --reload


🎯 Что вы получили:
Полноценное REST API для интернет-магазина

Аутентификацию через JWT токены

Все основные функции: товары, категории, корзина, заказы, отзывы

Документацию API автоматически по адресу http://localhost:8000/docs

Тестовые данные для быстрого старта

📖 Объяснение ключевых концепций:
Модели (models.py) - описывают структуру таблиц в БД

Схемы (schemas.py) - валидируют входящие/исходящие данные

CRUD (crud.py) - функции для работы с БД

Роутеры (routers/) - обработка HTTP запросов

Аутентификация (auth.py) - регистрация, вход, проверка токенов

Теперь у вас есть работающий бэкенд! Откройте http://localhost:8000/docs в браузере, чтобы увидеть интерактивную документацию API.