import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card__image">
        <img src={product.image} alt={product.name} />
        {product.oldPrice && (
          <span className="product-card__badge">-{Math.round((1 - product.price/product.oldPrice) * 100)}%</span>
        )}
        {isHovered && (
          <button className="product-card__quick-view">Быстрый просмотр</button>
        )}
      </div>
      
      <div className="product-card__info">
        <h3 className="product-card__brand">{product.brand}</h3>
        <h4 className="product-card__name">{product.name}</h4>
        
        <div className="product-card__rating">
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
          <span className="product-card__reviews">({product.reviews})</span>
        </div>
        
        <div className="product-card__price">
          <span className="current-price">${product.price}</span>
          {product.oldPrice && (
            <span className="old-price">${product.oldPrice}</span>
          )}
        </div>
        
        <button 
          className={`product-card__btn ${addedToCart ? 'added' : ''}`}
          onClick={addToCart}
        >
          {addedToCart ? '✓ Добавлено!' : 'В корзину'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;