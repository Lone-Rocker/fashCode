# Pydantic схемы для валидации данных (DTO - Data Transfer Objects)
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# ========== Схемы для пользователей ==========
class UserBase(BaseModel):
    """Базовая схема пользователя"""
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    """Схема для создания пользователя"""
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    """Схема для входа пользователя"""
    email: EmailStr
    password: str

class UserResponse(UserBase):
    """Схема ответа с данными пользователя"""
    id: UUID
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True  # Для работы с SQLAlchemy моделями

# ========== Схемы для категорий ==========
class CategoryBase(BaseModel):
    """Базовая схема категории"""
    name: str
    slug: str
    description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    """Схема для создания категории"""
    parent_id: Optional[UUID] = None

class CategoryResponse(CategoryBase):
    """Схема ответа с категорией"""
    id: UUID
    parent_id: Optional[UUID] = None
    
    class Config:
        from_attributes = True

# ========== Схемы для товаров ==========
class ProductBase(BaseModel):
    """Базовая схема товара"""
    name: str
    slug: str
    description: Optional[str] = None
    price: float = Field(..., ge=0)  # ge - больше или равно
    discount_price: Optional[float] = Field(None, ge=0)
    stock_quantity: int = Field(0, ge=0)
    brand: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    image_url: Optional[str] = None
    images_json: Optional[str] = None
    is_active: bool = True

class ProductCreate(ProductBase):
    """Схема для создания товара"""
    category_id: Optional[UUID] = None

class ProductUpdate(BaseModel):
    """Схема для обновления товара (все поля опциональны)"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    discount_price: Optional[float] = Field(None, ge=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    brand: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[UUID] = None

class ProductResponse(ProductBase):
    """Схема ответа с товаром"""
    id: UUID
    rating: float
    reviews_count: int
    category_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ========== Схемы для корзины ==========
class CartItemBase(BaseModel):
    """Базовая схема товара в корзине"""
    product_id: UUID
    quantity: int = Field(1, ge=1)

class CartItemCreate(CartItemBase):
    """Схема для добавления товара в корзину"""
    pass

class CartItemResponse(CartItemBase):
    """Схема ответа с товаром в корзине"""
    id: UUID
    user_id: UUID
    created_at: datetime
    # Добавляем информацию о товаре
    product: Optional[ProductResponse] = None
    
    class Config:
        from_attributes = True

# ========== Схемы для заказов ==========
class OrderItemCreate(BaseModel):
    """Схема товара в заказе"""
    product_id: UUID
    quantity: int = Field(..., ge=1)

class OrderCreate(BaseModel):
    """Схема для создания заказа"""
    shipping_address: str
    shipping_phone: Optional[str] = None
    order_notes: Optional[str] = None
    payment_method: str = "cash"  # cash, card, online

class OrderItemResponse(BaseModel):
    """Схема ответа с товаром в заказе"""
    id: UUID
    product_id: UUID
    quantity: int
    price_at_time: float
    product: Optional[ProductResponse] = None
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    """Схема ответа с заказом"""
    id: UUID
    user_id: UUID
    total_amount: float
    status: str
    payment_method: Optional[str] = None
    payment_status: str
    shipping_address: str
    shipping_phone: Optional[str] = None
    order_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True

# ========== Схемы для отзывов ==========
class ReviewBase(BaseModel):
    """Базовая схема отзыва"""
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    """Схема для создания отзыва"""
    product_id: UUID

class ReviewResponse(ReviewBase):
    """Схема ответа с отзывом"""
    id: UUID
    user_id: UUID
    product_id: UUID
    is_approved: bool
    created_at: datetime
    # Добавляем информацию о пользователе
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

# ========== Схемы для ответов с токеном ==========
class Token(BaseModel):
    """Схема токена доступа"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Данные в токене"""
    user_id: Optional[UUID] = None