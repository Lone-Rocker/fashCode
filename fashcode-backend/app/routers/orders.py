# Роутер для работы с заказами
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas, auth
from app.database import get_db
from app import models

router = APIRouter()

@router.post("/create", response_model=schemas.OrderResponse)
def create_order(
    order: schemas.OrderCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Создать заказ из товаров в корзине"""
    # Получаем товары из корзины
    cart_items = crud.get_cart_items(db, current_user.id)
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Проверяем наличие всех товаров на складе
    for item in cart_items:
        product = crud.get_product(db, item.product_id)
        if not product or product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Product {product.name if product else 'unknown'} is out of stock"
            )
        item.product = product
    
    # Создаём заказ
    db_order = crud.create_order(db, current_user.id, order, cart_items)
    
    # Получаем товары для ответа
    order_items = db.query(models.OrderItem).filter(
        models.OrderItem.order_id == db_order.id
    ).all()
    
    for item in order_items:
        item.product = crud.get_product(db, item.product_id)
    
    db_order.items = order_items
    return db_order

@router.get("/", response_model=List[schemas.OrderResponse])
def get_my_orders(
    skip: int = 0,
    limit: int = 50,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получить все заказы текущего пользователя"""
    orders = crud.get_user_orders(db, current_user.id, skip, limit)
    
    # Добавляем товары к каждому заказу
    for order in orders:
        items = db.query(models.OrderItem).filter(
            models.OrderItem.order_id == order.id
        ).all()
        for item in items:
            item.product = crud.get_product(db, item.product_id)
        order.items = items
    
    return orders

@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(
    order_id: str,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получить детали конкретного заказа"""
    from uuid import UUID
    order = db.query(models.Order).filter(models.Order.id == UUID(order_id)).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Проверяем, что заказ принадлежит пользователю или пользователь - админ
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
    items = db.query(models.OrderItem).filter(
        models.OrderItem.order_id == order.id
    ).all()
    
    for item in items:
        item.product = crud.get_product(db, item.product_id)
    
    order.items = items
    return order