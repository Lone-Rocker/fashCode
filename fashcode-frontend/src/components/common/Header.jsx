import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header__container">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">👕</span>
          <span className="header__logo-text">FashCode</span>
        </Link>

        <button 
          className="header__burger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Главная</Link></li>
            <li><Link to="/catalog" onClick={() => setIsMenuOpen(false)}>Каталог</Link></li>
            <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>🛒 Корзина</Link></li>
            <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>👤 Профиль</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;