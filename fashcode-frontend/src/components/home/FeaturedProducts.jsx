import React, { useState, useEffect } from 'react';
import ProductCard from '../catalog/ProductCard';
import './FeaturedProducts.css';
import img1 from "../../img/coat.jpg"
import img2 from "../../img/slim.jpg"
import img3 from "../../img/t-shirt.jpg"
import img4 from "../../img/shoues.jpg"
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки товаров
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Классическая футболка',
          price: 29.99,
          oldPrice: 49.99,
          brand: 'FashCode',
          image: img3,
          rating: 4.5,
          reviews: 128
        },
        {
          id: 2,
          name: 'Слим джинсы',
          price: 89.99,
          oldPrice: 129.99,
          brand: 'DenimCo',
          image: img2,
          rating: 4.8,
          reviews: 95
        },
        {
          id: 3,
          name: 'Кожаная куртка',
          price: 199.99,
          oldPrice: 299.99,
          brand: 'LeatherStyle',
          image: img1,
          rating: 4.9,
          reviews: 67
        },
        {
          id: 4,
          name: 'Спортивные кроссовки',
          price: 79.99,
          oldPrice: 119.99,
          brand: 'SportMax',
          image: img4,
          rating: 4.7,
          reviews: 203
        }
      ];
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="featured">
      <div className="container">
        <div className="featured__header">
          <h2 className="featured__title">Популярные товары</h2>
          <p className="featured__subtitle">Самые востребованные модели этого сезона</p>
          <div className="featured__badges">
            <button className="badge active">Все</button>
            <button className="badge">Новинки</button>
            <button className="badge">Хиты продаж</button>
            <button className="badge">Со скидкой</button>
          </div>
        </div>
        
        {loading ? (
          <div className="featured__loading">
            <div className="loader"></div>
            <p>Загрузка товаров...</p>
          </div>
        ) : (
          <div className="featured__grid">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        <div className="featured__footer">
          <button className="btn btn-primary" onClick={() => window.location.href='/catalog'}>
            Смотреть все товары →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;