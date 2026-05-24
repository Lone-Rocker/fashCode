# Роутер для работы с категориями
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app import crud, schemas, auth
from app.database import get_db
from app import models

router = APIRouter()

@router.get("/", response_model=List[schemas.CategoryResponse])
def read_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    parent_id: Optional[UUID] = None,
    db: Session = Depends(get_db)
):
    """
    Получить список всех категорий
    - **parent_id**: фильтр по родительской категории
    """
    categories = crud.get_categories(db, skip=skip, limit=limit, parent_id=parent_id)
    return categories

@router.get("/{category_id}", response_model=schemas.CategoryResponse)
def read_category(
    category_id: UUID,
    db: Session = Depends(get_db)
):
    """Получить информацию о конкретной категории"""
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/", response_model=schemas.CategoryResponse)
def create_category(
    category: schemas.CategoryCreate,
    current_user: models.User = Depends(auth.get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Создать новую категорию (только для администратора)"""
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category