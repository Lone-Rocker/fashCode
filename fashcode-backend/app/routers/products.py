# Роутер для работы с товарами
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app import crud, schemas, auth
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.ProductResponse])
def read_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category_id: Optional[UUID] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Получить список всех товаров
    - **skip**: сколько пропустить (для пагинации)
    - **limit**: сколько взять
    - **category_id**: фильтр по категории
    - **search**: поиск по названию
    """
    products = crud.get_products(db, skip=skip, limit=limit, category_id=category_id)
    
    # Если есть поисковый запрос, фильтруем
    if search:
        products = [p for p in products if search.lower() in p.name.lower()]
    
    return products

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def read_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):
    """Получить информацию о конкретном товаре"""
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not product.is_active:
        raise HTTPException(status_code=404, detail="Product not available")
    return product

@router.post("/", response_model=schemas.ProductResponse)
def create_product(
    product: schemas.ProductCreate,
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Создать новый товар (только для администратора)"""
    return crud.create_product(db=db, product=product)

@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: UUID,
    product_update: schemas.ProductUpdate,
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Обновить товар (только для администратора)"""
    product = crud.update_product(db, product_id, product_update)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: UUID,
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Удалить товар (мягкое удаление, только для администратора)"""
    success = crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}