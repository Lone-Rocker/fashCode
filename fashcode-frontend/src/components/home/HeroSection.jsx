import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const scrollToCatalog = () => {
    window.location.href = '/catalog';
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero__pattern"></div>
      <div className="container hero__container">
        <div className="hero__content fade-in">
          <span className="hero__badge">🔥 Летняя распродажа</span>
          <h1 className="hero__title">
            Стиль, который <span className="hero__highlight">вдохновляет</span>
          </h1>
          <p className="hero__subtitle">
            Открой для себя уникальные коллекции одежды от лучших брендов. 
            Скидки до 50% на первую покупку!
          </p>
          <div className="hero__buttons">
            <button className="btn btn-primary" onClick={scrollToCatalog}>
              Купить сейчас →
            </button>
            <button className="btn btn-secondary" onClick={scrollToAbout}>
              Узнать больше
            </button>
          </div>
          <div className="hero__stats">
            <div className="stat">
              <span className="stat__number">500+</span>
              <span className="stat__label">Товаров</span>
            </div>
            <div className="stat">
              <span className="stat__number">10k+</span>
              <span className="stat__label">Покупателей</span>
            </div>
            <div className="stat">
              <span className="stat__number">24/7</span>
              <span className="stat__label">Поддержка</span>
            </div>
          </div>
        </div>
        
        <div className="hero__features">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Бесплатная доставка</h3>
            <p>При заказе от 5000₽</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Легкий возврат</h3>
            <p>30 дней на возврат</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Безопасная оплата</h3>
            <p>Защита ваших данных</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;