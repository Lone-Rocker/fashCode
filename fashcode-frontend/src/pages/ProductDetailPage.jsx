import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');

  const product = {
    id: id,
    name: 'Классическая футболка',
    brand: 'FashCode',
    price: 29.99,
    oldPrice: 49.99,
    description: 'Высококачественная футболка из 100% хлопка. Идеально подходит для повседневной носки. Дышащий материал обеспечивает комфорт в течение всего дня.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['black', 'white', 'blue', 'red'],
    images: [
      'https://cdn.pixabay.com/photo/2016/11/29/01/30/man-1866574_640.jpg',
      'https://cdn.pixabay.com/photo/2017/08/07/15/40/jeans-2604864_640.jpg'
    ]
  };

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-detail__grid">
          <div className="product-detail__gallery">
            <img src={product.images[0]} alt={product.name} className="main-image" />
          </div>
          
          <div className="product-detail__info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-brand">{product.brand}</p>
            
            <div className="product-price">
              <span className="current">${product.price}</span>
              <span className="old">${product.oldPrice}</span>
            </div>
            
            <div className="product-size">
              <h3>Выберите размер:</h3>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="product-color">
              <h3>Цвет:</h3>
              <div className="color-options">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="product-quantity">
              <h3>Количество:</h3>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            
            <button className="btn btn-primary add-to-cart">
              Добавить в корзину - ${(product.price * quantity).toFixed(2)}
            </button>
            
            <div className="product-description">
              <h3>Описание:</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;