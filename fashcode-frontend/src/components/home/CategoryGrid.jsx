import React from 'react';
import './CategoryGrid.css';

const categories = [
  { id: 1, name: 'Футболки', icon: '👕', color: '#FF6B6B', count: 128 },
  { id: 2, name: 'Джинсы', icon: '👖', color: '#4ECDC4', count: 64 },
  { id: 3, name: 'Куртки', icon: '🧥', color: '#45B7D1', count: 42 },
  { id: 4, name: 'Аксессуары', icon: '🧢', color: '#96CEB4', count: 156 },
  { id: 5, name: 'Платья', icon: '👗', color: '#FFEAA7', count: 89 },
  { id: 6, name: 'Обувь', icon: '👟', color: '#DDA0DD', count: 73 }
];

const CategoryGrid = () => {
  return (
    <section className="categories">
      <div className="container">
        <div className="categories__header">
          <h2 className="categories__title">Популярные категории</h2>
          <p className="categories__subtitle">Выберите категорию и найдите свой идеальный образ</p>
        </div>
        <div className="categories__grid">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className="category-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => window.location.href=`/catalog?category=${category.id}`}
            >
              <div className="category-card__icon" style={{ background: category.color }}>
                {category.icon}
              </div>
              <h3 className="category-card__name">{category.name}</h3>
              <p className="category-card__count">{category.count} товаров</p>
              <div className="category-card__hover"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;