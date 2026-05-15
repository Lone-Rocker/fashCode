import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загрузка корзины из localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      // Моковые данные для демонстрации
      const mockCart = [
        {
          id: 1,
          name: 'Классическая футболка',
          price: 29.99,
          quantity: 2,
          size: 'M',
          color: 'black',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
          brand: 'FashCode'
        },
        {
          id: 2,
          name: 'Слим джинсы',
          price: 89.99,
          quantity: 1,
          size: '32',
          color: 'blue',
          image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200',
          brand: 'DenimCo'
        }
      ];
      setCartItems(mockCart);
    }
    setLoading(false);
  }, []);

  // Сохранение корзины в localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromo = () => {
    if (promoCode === 'FASHCODE20') {
      setDiscount(subtotal * 0.2);
      alert('✅ Промокод применен! Скидка 20%');
    } else if (promoCode === 'WELCOME10') {
      setDiscount(subtotal * 0.1);
      alert('✅ Промокод применен! Скидка 10%');
    } else if (promoCode === 'FREESHIP') {
      setDiscount(10);
      alert('✅ Промокод применен! Скидка 10$ на доставку');
    } else {
      alert('❌ Неверный промокод');
    }
    setPromoCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    alert('🎉 Заказ оформлен! Спасибо за покупку!');
    setCartItems([]);
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loader"></div>
        <p>Загрузка корзины...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Ваша корзина пуста</h2>
            <p>Похоже, вы еще не добавили ни одного товара</p>
            <Link to="/catalog" className="btn btn-primary">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Корзина</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <div>Товар</div>
              <div>Цена</div>
              <div>Количество</div>
              <div>Итого</div>
              <div></div>
            </div>
            
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-brand">{item.brand}</p>
                    <div className="cart-item-attributes">
                      <span>Размер: {item.size}</span>
                      <span>Цвет: {item.color}</span>
                    </div>
                  </div>
                </div>
                
                <div className="cart-item-price">${item.price.toFixed(2)}</div>
                
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                
                <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
                
                <button 
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
            
            <div className="cart-actions">
              <Link to="/catalog" className="btn btn-secondary">
                ← Продолжить покупки
              </Link>
              <button 
                className="btn btn-danger"
                onClick={() => setCartItems([])}
              >
                Очистить корзину
              </button>
            </div>
          </div>
          
          <div className="cart-summary">
            <h3>Итого по заказу</h3>
            
            <div className="summary-row">
              <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Доставка:</span>
              <span>{shipping === 0 ? 'Бесплатно' : `$${shipping}`}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Скидка:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="summary-row total">
              <span>Итого к оплате:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="promo-section">
              <input 
                type="text" 
                placeholder="Введите промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button onClick={applyPromo} className="promo-btn">
                Применить
              </button>
            </div>
            
            <div className="promo-info">
              <p>Доступные промокоды:</p>
              <ul>
                <li>FASHCODE20 - скидка 20%</li>
                <li>WELCOME10 - скидка 10%</li>
                <li>FREESHIP - скидка 10$</li>
              </ul>
            </div>
            
            <button className="checkout-btn" onClick={handleCheckout}>
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;