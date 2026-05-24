# Модели SQLAlchemy - отображение таблиц БД на Python объекты
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import uuid

class User(Base):
    """Модель пользователя"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    address = Column(Text)
    role = Column(String(20), default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)

class Category(Base):
    """Модель категории товаров"""
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"))
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class Product(Base):
    """Модель товара"""
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    discount_price = Column(Float)
    stock_quantity = Column(Integer, default=0)
    brand = Column(String(100))
    size = Column(String(20))
    color = Column(String(50))
    image_url = Column(String(500))
    images_json = Column(Text)
    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)

class Order(Base):
    """Модель заказа"""
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    payment_method = Column(String(50))
    payment_status = Column(String(50), default="pending")
    shipping_address = Column(Text, nullable=False)
    shipping_phone = Column(String(20))
    order_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class OrderItem(Base):
    """Модель товара в заказе"""
    __tablename__ = "order_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_time = Column(Float, nullable=False)

class CartItem(Base):
    """Модель корзины покупок"""
    __tablename__ = "cart_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Уникальное ограничение: один пользователь - один товар
    __table_args__ = (UniqueConstraint('user_id', 'product_id', name='unique_user_product'),)

class Review(Base):
    """Модель отзыва о товаре"""
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_approved = Column(Boolean, default=False)

class Wishlist(Base):
    """Модель списка желаний"""
    __tablename__ = "wishlist"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Уникальное ограничение: один пользователь - один товар
    __table_args__ = (UniqueConstraint('user_id', 'product_id', name='unique_user_product_wishlist'),)