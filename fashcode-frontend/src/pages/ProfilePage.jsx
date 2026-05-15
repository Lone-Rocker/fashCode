import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Тверская, д. 15, кв. 48',
    birthDate: '1995-06-15',
    gender: 'male'
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Моковые данные заказов
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-2024-001',
          date: '2024-01-15',
          total: 129.99,
          status: 'delivered',
          statusText: 'Доставлен',
          items: [
            { name: 'Классическая футболка', quantity: 2, price: 29.99 },
            { name: 'Слим джинсы', quantity: 1, price: 69.99 }
          ]
        },
        {
          id: 'ORD-2024-002',
          date: '2024-01-20',
          total: 89.99,
          status: 'shipped',
          statusText: 'В пути',
          items: [
            { name: 'Кожаная куртка', quantity: 1, price: 89.99 }
          ]
        },
        {
          id: 'ORD-2024-003',
          date: '2024-01-25',
          total: 199.99,
          status: 'processing',
          statusText: 'Обработка',
          items: [
            { name: 'Спортивные кроссовки', quantity: 1, price: 79.99 },
            { name: 'Худи с капюшоном', quantity: 1, price: 59.99 },
            { name: 'Рубашка поло', quantity: 1, price: 39.99 }
          ]
        },
        {
          id: 'ORD-2024-004',
          date: '2024-02-01',
          total: 159.99,
          status: 'pending',
          statusText: 'Ожидает оплаты',
          items: [
            { name: 'Платье летнее', quantity: 1, price: 49.99 },
            { name: 'Шорты летние', quantity: 2, price: 34.99 },
            { name: 'Футболка', quantity: 1, price: 29.99 }
          ]
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    alert('✅ Данные профиля успешно обновлены!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#27ae60';
      case 'shipped': return '#3498db';
      case 'processing': return '#f39c12';
      case 'pending': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <button className="change-avatar-btn">Изменить фото</button>
          </div>
          <div className="profile-welcome">
            <h1>Добро пожаловать, {user.firstName}!</h1>
            <p>Рады снова видеть вас в FashCode</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Личные данные
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Мои заказы ({orders.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            ❤️ Избранное
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-form-card">
              <div className="card-header">
                <h2>Личная информация</h2>
                {!isEditing ? (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    ✏️ Редактировать
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>Сохранить</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Отмена</button>
                  </div>
                )}
              </div>
              
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Имя</label>
                    <input 
                      type="text" 
                      value={user.firstName}
                      onChange={(e) => setUser({...user, firstName: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>Фамилия</label>
                    <input 
                      type="text" 
                      value={user.lastName}
                      onChange={(e) => setUser({...user, lastName: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>Телефон</label>
                    <input 
                      type="tel" 
                      value={user.phone}
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Дата рождения</label>
                    <input 
                      type="date" 
                      value={user.birthDate}
                      onChange={(e) => setUser({...user, birthDate: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? 'readonly' : ''}
                    />
                  </div>
                  <div className="form-group">
                    <label>Пол</label>
                    <select 
                      value={user.gender}
                      onChange={(e) => setUser({...user, gender: e.target.value})}
                      disabled={!isEditing}
                      className={!isEditing ? 'readonly' : ''}
                    >
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                      <option value="other">Другой</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Адрес доставки</label>
                  <textarea 
                    value={user.address}
                    onChange={(e) => setUser({...user, address: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    className={!isEditing ? 'readonly' : ''}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-card">
              {loading ? (
                <div className="loading-spinner">
                  <div className="loader"></div>
                  <p>Загрузка заказов...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <div className="empty-icon">📦</div>
                  <h3>У вас пока нет заказов</h3>
                  <p>Перейдите в каталог, чтобы сделать первый заказ</p>
                  <button className="btn btn-primary" onClick={() => window.location.href='/catalog'}>
                    Перейти в каталог
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-number">Заказ №{order.id}</span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <div className="order-status">
                          <span 
                            className="status-badge"
                            style={{ background: getStatusColor(order.status) }}
                          >
                            {order.statusText}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <span>{item.name}</span>
                            <span>{item.quantity} шт × ${item.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-footer">
                        <div className="order-total">
                          <strong>Итого:</strong> ${order.total}
                        </div>
                        <button className="order-details-btn">Подробнее →</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="wishlist-card">
              <div className="empty-wishlist">
                <div className="empty-icon">❤️</div>
                <h3>Список желаний пуст</h3>
                <p>Добавляйте товары в избранное, чтобы не потерять их</p>
                <button className="btn btn-primary" onClick={() => window.location.href='/catalog'}>
                  Перейти в каталог
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;