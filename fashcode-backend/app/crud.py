# CRUD операции с базой данных (Create, Read, Update, Delete)
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app import models, schemas
from uuid import UUID
from typing import Optional, List

# ========== CRUD для товаров ==========
def get_product(db: Session, product_id: UUID):
    """Получить товар по ID"""
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100, category_id: Optional[UUID] = None):
    """Получить список товаров с пагинацией и фильтрацией по категории"""
    query = db.query(models.Product).filter(models.Product.is_active == True)
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    """Создать новый товар"""
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: UUID, product_update: schemas.ProductUpdate):
    """Обновить товар"""
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    # Обновляем только переданные поля
    update_data = product_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: UUID):
    """Удалить товар (мягкое удаление)"""
    db_product = get_product(db, product_id)
    if db_product:
        db_product.is_active = False
        db.commit()
        return True
    return False

# ========== CRUD для категорий ==========
def get_categories(db: Session, skip: int = 0, limit: int = 100, parent_id: Optional[UUID] = None):
    """Получить список категорий"""
    query = db.query(models.Category).filter(models.Category.is_active == True)
    if parent_id:
        query = query.filter(models.Category.parent_id == parent_id)
    return query.order_by(models.Category.sort_order).offset(skip).limit(limit).all()

# ========== CRUD для корзины ==========
def get_cart_items(db: Session, user_id: UUID):
    """Получить все товары в корзине пользователя"""
    return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

def add_to_cart(db: Session, user_id: UUID, cart_item: schemas.CartItemCreate):
    """Добавить товар в корзину"""
    # Проверяем, есть ли уже такой товар в корзине
    existing = db.query(models.CartItem).filter(
        and_(
            models.CartItem.user_id == user_id,
            models.CartItem.product_id == cart_item.product_id
        )
    ).first()
    
    if existing:
        # Если есть - увеличиваем количество
        existing.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Если нет - создаём новый
        db_item = models.CartItem(
            user_id=user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

def remove_from_cart(db: Session, user_id: UUID, product_id: UUID):
    """Удалить товар из корзины"""
    db_item = db.query(models.CartItem).filter(
        and_(
            models.CartItem.user_id == user_id,
            models.CartItem.product_id == product_id
        )
    ).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False

def update_cart_quantity(db: Session, user_id: UUID, product_id: UUID, quantity: int):
    """Обновить количество товара в корзине"""
    db_item = db.query(models.CartItem).filter(
        and_(
            models.CartItem.user_id == user_id,
            models.CartItem.product_id == product_id
        )
    ).first()
    if db_item:
        if quantity <= 0:
            return remove_from_cart(db, user_id, product_id)
        db_item.quantity = quantity
        db.commit()
        db.refresh(db_item)
        return db_item
    return None

# ========== CRUD для заказов ==========
def create_order(db: Session, user_id: UUID, order: schemas.OrderCreate, cart_items: List):
    """Создать заказ из товаров корзины"""
    # Вычисляем общую сумму
    total_amount = 0
    order_items_data = []
    
    for cart_item in cart_items:
        product = cart_item.product
        price = product.discount_price if product.discount_price else product.price
        item_total = price * cart_item.quantity
        total_amount += item_total
        order_items_data.append({
            "product_id": cart_item.product_id,
            "quantity": cart_item.quantity,
            "price_at_time": price
        })
    
    # Создаём заказ
    db_order = models.Order(
        user_id=user_id,
        total_amount=total_amount,
        shipping_address=order.shipping_address,
        shipping_phone=order.shipping_phone,
        order_notes=order.order_notes,
        payment_method=order.payment_method
    )
    db.add(db_order)
    db.flush()  # Чтобы получить ID заказа
    
    # Создаём товары в заказе
    for item_data in order_items_data:
        db_item = models.OrderItem(
            order_id=db_order.id,
            **item_data
        )
        db.add(db_item)
        
        # Уменьшаем количество товара на складе
        product = db.query(models.Product).filter(models.Product.id == item_data["product_id"]).first()
        if product:
            product.stock_quantity -= item_data["quantity"]
    
    # Очищаем корзину пользователя
    db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_user_orders(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    """Получить заказы пользователя"""
    return db.query(models.Order).filter(models.Order.user_id == user_id).order_by(
        models.Order.created_at.desc()
    ).offset(skip).limit(limit).all()