import React, { useState, useEffect } from 'react';
import ProductCard from '../components/catalog/ProductCard';
import './CatalogPage.css';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: 'all',
    size: 'all',
    color: 'all',
    sort: 'popular'
  });

  // Моковые данные товаров
  useEffect(() => {
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Классическая футболка',
          price: 29.99,
          oldPrice: 49.99,
          brand: 'FashCode',
          category: 't-shirts',
          size: ['S', 'M', 'L', 'XL'],
          color: ['black', 'white'],
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0zg5KO4nlER3qUW_Obef3kcOhMZ4v6HKIGA&s',
          rating: 4.5,
          reviews: 128,
          isNew: true
        },
        {
          id: 2,
          name: 'Слим джинсы',
          price: 89.99,
          oldPrice: 129.99,
          brand: 'DenimCo',
          category: 'jeans',
          size: ['30', '32', '34', '36'],
          color: ['blue', 'black'],
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ8BnJXIM8w4rNqWDCLL5NJV-d1lrIqRXM2Q&s',
          rating: 4.8,
          reviews: 95,
          isNew: false
        },
        {
          id: 3,
          name: 'Кожаная куртка',
          price: 199.99,
          oldPrice: 299.99,
          brand: 'LeatherStyle',
          category: 'jackets',
          size: ['S', 'M', 'L'],
          color: ['black', 'brown'],
          image: 'https://smartcasuals.ru/wp-content/uploads/2020/09/DSC_3141-Edit.jpg',
          rating: 4.9,
          reviews: 67,
          isNew: true
        },
        {
          id: 4,
          name: 'Спортивные кроссовки',
          price: 79.99,
          oldPrice: 119.99,
          brand: 'SportMax',
          category: 'shoes',
          size: ['39', '40', '41', '42', '43'],
          color: ['white', 'black', 'red'],
          image: 'https://ir.ozone.ru/s3/multimedia-o/c1000/6699087852.jpg',
          rating: 4.7,
          reviews: 203,
          isNew: false
        },
        {
          id: 5,
          name: 'Худи с капюшоном',
          price: 59.99,
          oldPrice: 89.99,
          brand: 'StreetWear',
          category: 'hoodies',
          size: ['S', 'M', 'L', 'XL'],
          color: ['gray', 'black', 'navy'],
          image: 'https://cdn.lmbd.ru/f9544273-7f6e-4a3a-be00-7de234aea05a/',
          rating: 4.6,
          reviews: 156,
          isNew: true
        },
        {
          id: 6,
          name: 'Платье летнее',
          price: 49.99,
          oldPrice: 79.99,
          brand: 'SummerStyle',
          category: 'dresses',
          size: ['XS', 'S', 'M', 'L'],
          color: ['floral', 'red', 'blue'],
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9jOaiHmaeihqVL2Wqi4hKwbs6WbytSlY9Pw&s',
          rating: 4.7,
          reviews: 89,
          isNew: false
        },
        {
          id: 7,
          name: 'Рубашка поло',
          price: 39.99,
          oldPrice: 59.99,
          brand: 'ClassicMan',
          category: 'shirts',
          size: ['S', 'M', 'L', 'XL'],
          color: ['white', 'blue', 'pink'],
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1RNfaEeMSL5-V729UJQr95hOHp_yxc4FlOA&s',
          rating: 4.4,
          reviews: 112,
          isNew: false
        },
        {
          id: 8,
          name: 'Шорты летние',
          price: 34.99,
          oldPrice: 49.99,
          brand: 'SummerStyle',
          category: 'shorts',
          size: ['S', 'M', 'L', 'XL'],
          color: ['khaki', 'black', 'navy'],
          image: 'https://img-edg.joomcdn.net/56794e550925f3932c5c003e9cb5c62ef347f68e_original.jpeg',
          rating: 4.5,
          reviews: 78,
          isNew: true
        }
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Фильтрация и сортировка
  useEffect(() => {
    let filtered = [...products];

    // Поиск
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.brand.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Категория
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Цена
    if (filters.priceRange === 'low') {
      filtered = filtered.filter(p => p.price < 50);
    } else if (filters.priceRange === 'medium') {
      filtered = filtered.filter(p => p.price >= 50 && p.price <= 100);
    } else if (filters.priceRange === 'high') {
      filtered = filtered.filter(p => p.price > 100);
    }

    // Сортировка
    if (filters.sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'new') {
      filtered = filtered.filter(p => p.isNew);
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priceRange: 'all',
      size: 'all',
      color: 'all',
      sort: 'popular'
    });
  };

  const categories = [
    { value: 'all', label: 'Все товары' },
    { value: 't-shirts', label: 'Футболки' },
    { value: 'jeans', label: 'Джинсы' },
    { value: 'jackets', label: 'Куртки' },
    { value: 'shoes', label: 'Обувь' },
    { value: 'hoodies', label: 'Худи' },
    { value: 'dresses', label: 'Платья' },
    { value: 'shirts', label: 'Рубашки' },
    { value: 'shorts', label: 'Шорты' }
  ];

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <div className="container">
          <h1>Каталог товаров</h1>
          <p>Выберите идеальный образ из нашей коллекции</p>
        </div>
      </div>

      <div className="container">
        <div className="catalog-content">
          {/* Кнопка для мобильных */}
          <button 
            className="filter-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '✕ Закрыть фильтры' : '☰ Фильтры'}
          </button>

          {/* Sidebar с фильтрами */}
          <aside className={`catalog-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="filter-section">
              <h3>Поиск</h3>
              <input 
                type="text" 
                className="filter-search"
                placeholder="Поиск товаров..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="filter-section">
              <h3>Категории</h3>
              <div className="filter-options">
                {categories.map(cat => (
                  <label key={cat.value} className="filter-option">
                    <input 
                      type="radio" 
                      name="category"
                      value={cat.value}
                      checked={filters.category === cat.value}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Цена</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="price"
                    value="all"
                    checked={filters.priceRange === 'all'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>Все цены</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="price"
                    value="low"
                    checked={filters.priceRange === 'low'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>До 50$</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="price"
                    value="medium"
                    checked={filters.priceRange === 'medium'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>50$ - 100$</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="price"
                    value="high"
                    checked={filters.priceRange === 'high'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>От 100$</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h3>Сортировка</h3>
              <select 
                className="filter-select"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="popular">По популярности</option>
                <option value="new">Новинки</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="rating">По рейтингу</option>
              </select>
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
              Сбросить все фильтры
            </button>
          </aside>

          {/* Основной контент */}
          <main className="catalog-main">
            <div className="catalog-info">
              <span>Найдено: {filteredProducts.length} товаров</span>
            </div>

            {loading ? (
              <div className="catalog-loading">
                <div className="loader"></div>
                <p>Загрузка товаров...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="catalog-empty">
                <div className="empty-icon">🔍</div>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;