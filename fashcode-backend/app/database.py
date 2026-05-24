# Настройка подключения к базе данных
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Загружаем переменные окружения из файла .env
load_dotenv()

# Получаем параметры подключения к БД из переменных окружения
# Если переменные не найдены, используем значения по умолчанию
SQLALCHEMY_DATABASE_URL = f"postgresql://{os.getenv('DB_USER', 'postgres')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'fashcode_db')}"

# Создаём движок SQLAlchemy
# connect_args нужны для работы с asyncpg
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Создаём фабрику сессий для работы с БД
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для всех моделей
Base = declarative_base()

# Функция для получения сессии БД (используется в зависимостях FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()