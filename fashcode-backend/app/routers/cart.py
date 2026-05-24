# Роутер для работы с корзиной
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app import crud, schemas, auth
from app.database import get_db
from app import models

router = APIRouter()

@router.get("/", response_model=List[schemas.CartItemResponse])
def get_cart(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получить содержимое корзины текущего пользователя"""
    cart_items = crud.get_cart_items(db, current_user.id)
    
    # Добавляем информацию о товарах
    for item in cart_items:
        item.product = crud.get_product(db, item.product_id)
    
    return cart_items

@router.post("/add", response_model=schemas.CartItemResponse)
def add_to_cart(
    cart_item: schemas.CartItemCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Добавить товар в корзину"""
    # Проверяем, существует ли товар
    product = crud.get_product(db, cart_item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Проверяем наличие на складе
    if product.stock_quantity < cart_item.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough stock. Available: {product.stock_quantity}"
        )
    
    result = crud.add_to_cart(db, current_user.id, cart_item)
    result.product = product
    return result

@router.put("/update/{product_id}")
def update_cart_quantity(
    product_id: UUID,
    quantity: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Обновить количество товара в корзине"""
    result = crud.update_cart_quantity(db, current_user.id, product_id, quantity)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return {"message": "Cart updated successfully"}

@router.delete("/remove/{product_id}")
def remove_from_cart(
    product_id: UUID,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Удалить товар из корзины"""
    success = crud.remove_from_cart(db, current_user.id, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return {"message": "Item removed from cart"}