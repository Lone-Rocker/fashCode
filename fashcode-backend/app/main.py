# Главный файл приложения FastAPI
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud, auth
from app.database import engine, get_db
from app.routers import products, categories, cart, orders

# Создаём таблицы в базе данных (если их нет)
models.Base.metadata.create_all(bind=engine)

# Создаём приложение FastAPI
app = FastAPI(
    title="FashCode API",
    description="API для интернет-магазина одежды",
    version="1.0.0"
)

# Настройка CORS (чтобы фронтенд мог обращаться к API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене нужно указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(cart.router, prefix="/api/cart", tags=["cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])

# ========== Эндпоинты для аутентификации ==========
@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    # Проверяем, не существует ли пользователь с таким email
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Проверяем имя пользователя
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Создаём нового пользователя
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        address=user.address
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Вход пользователя и получение токена"""
    # Аутентифицируем пользователя
    db_user = auth.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Обновляем время последнего входа
    db_user.last_login = models.func.now()
    db.commit()
    
    # Создаём токен доступа
    access_token = auth.create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_active_user)):
    """Получить информацию о текущем пользователе"""
    return current_user

# ========== Корневой эндпоинт ==========
@app.get("/")
def root():
    return {"message": "Welcome to FashCode API", "status": "running"}

# ========== Эндпоинты для отзывов ==========
@app.post("/api/reviews", response_model=schemas.ReviewResponse)
def create_review(
    review: schemas.ReviewCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Создать отзыв о товаре"""
    # Проверяем, существует ли товар
    product = crud.get_product(db, review.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Создаём отзыв
    db_review = models.Review(
        user_id=current_user.id,
        product_id=review.product_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    
    # Обновляем рейтинг товара
    reviews = db.query(models.Review).filter(
        models.Review.product_id == review.product_id,
        models.Review.is_approved == True
    ).all()
    
    if reviews:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)
        product.rating = round(avg_rating, 2)
        product.reviews_count = len(reviews)
    
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/api/products/{product_id}/reviews", response_model=List[schemas.ReviewResponse])
def get_product_reviews(
    product_id: str,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Получить отзывы о товаре"""
    from uuid import UUID
    reviews = db.query(models.Review).filter(
        models.Review.product_id == UUID(product_id),
        models.Review.is_approved == True
    ).offset(skip).limit(limit).all()
    return reviews