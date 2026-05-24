INSERT INTO categories (id, name, slug, description, sort_order) VALUES
(gen_random_uuid(), 'Мужская одежда', 'mens-clothing', 'Одежда для мужчин', 1),
(gen_random_uuid(), 'Женская одежда', 'womens-clothing', 'Одежда для женщин', 2),
(gen_random_uuid(), 'Детская одежда', 'kids-clothing', 'Одежда для детей', 3),
(gen_random_uuid(), 'Обувь', 'footwear', 'Обувь для всей семьи', 4),
(gen_random_uuid(), 'Аксессуары', 'accessories', 'Модные аксессуары', 5);

DO $$
DECLARE
    mens_id UUID;
    womens_id UUID;
BEGIN
    SELECT id INTO mens_id FROM categories WHERE slug = 'mens-clothing';
    SELECT id INTO womens_id FROM categories WHERE slug = 'womens-clothing';
    
    INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
    (gen_random_uuid(), 'Футболки', 't-shirts', mens_id, 1),
    (gen_random_uuid(), 'Джинсы', 'jeans', mens_id, 2),
    (gen_random_uuid(), 'Куртки', 'jackets', mens_id, 3),
    (gen_random_uuid(), 'Платья', 'dresses', womens_id, 1),
    (gen_random_uuid(), 'Юбки', 'skirts', womens_id, 2);
END $$;

INSERT INTO users (id, email, username, password_hash, first_name, last_name, phone, address, role) VALUES
(gen_random_uuid(), 'admin@fashcode.com', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYrLqzJ.6lXS', 'Admin', 'FashCode', '+7 (999) 111-22-33', 'Москва, ул. Административная, д. 1', 'admin'),
(gen_random_uuid(), 'ivan@example.com', 'ivan_petrov', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYrLqzJ.6lXS', 'Иван', 'Петров', '+7 (999) 123-45-67', 'Москва, ул. Тверская, д. 15, кв. 48', 'user'),
(gen_random_uuid(), 'maria@example.com', 'maria_s', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYrLqzJ.6lXS', 'Мария', 'Сидорова', '+7 (999) 234-56-78', 'Санкт-Петербург, Невский пр., д. 25', 'user'),
(gen_random_uuid(), 'alex@example.com', 'alex_k', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYrLqzJ.6lXS', 'Алексей', 'Кузнецов', '+7 (999) 345-67-89', 'Новосибирск, ул. Ленина, д. 50', 'user');

DO $$
DECLARE
    tshirts_id UUID;
    jeans_id UUID;
    dresses_id UUID;
BEGIN
    SELECT id INTO tshirts_id FROM categories WHERE name = 'Футболки';
    SELECT id INTO jeans_id FROM categories WHERE name = 'Джинсы';
    SELECT id INTO dresses_id FROM categories WHERE name = 'Платья';
    
    INSERT INTO products (id, name, slug, description, price, discount_price, stock_quantity, brand, size, color, image_url, category_id, rating) VALUES
    (gen_random_uuid(), 'Классическая футболка', 'classic-t-shirt', 'Удобная футболка из 100% хлопка. Идеально подходит для повседневной носки.', 29.99, 24.99, 150, 'FashCode', 'M', 'Белый', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', tshirts_id, 4.5),
    (gen_random_uuid(), 'Слим джинсы', 'slim-jeans', 'Модные джинсы со стрейч-эффектом. Отлично сидят по фигуре.', 89.99, 69.99, 75, 'DenimCo', '32', 'Синий', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246', jeans_id, 4.8),
    (gen_random_uuid(), 'Летнее платье', 'summer-dress', 'Легкое платье из натуральных тканей. Идеально для жаркой погоды.', 49.99, 39.99, 45, 'SummerStyle', 'S', 'Цветочный', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c', dresses_id, 4.7),
    (gen_random_uuid(), 'Кожаная куртка', 'leather-jacket', 'Стильная кожаная куртка классического кроя.', 199.99, 159.99, 30, 'LeatherStyle', 'L', 'Черный', 'https://images.unsplash.com/photo-1551028719-00167b16eac5', (SELECT id FROM categories WHERE name = 'Куртки'), 4.9),
    (gen_random_uuid(), 'Спортивные кроссовки', 'sports-shoes', 'Удобные кроссовки для бега и повседневной носки.', 79.99, NULL, 120, 'Nike', '42', 'Белый', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', (SELECT id FROM categories WHERE name = 'Обувь'), 4.6),
    (gen_random_uuid(), 'Худи с капюшоном', 'hoodie', 'Теплое худи с мягким флисом внутри.', 59.99, 49.99, 90, 'StreetWear', 'L', 'Серый', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', tshirts_id, 4.7),
    (gen_random_uuid(), 'Рубашка поло', 'polo-shirt', 'Классическая рубашка поло для офиса и повседневной жизни.', 39.99, 34.99, 110, 'ClassicMan', 'M', 'Белый', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10', tshirts_id, 4.4),
    (gen_random_uuid(), 'Шорты летние', 'summer-shorts', 'Комфортные шорты для активного отдыха.', 34.99, 29.99, 85, 'SummerStyle', 'L', 'Хаки', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b', (SELECT id FROM categories WHERE name = 'Шорты' AND parent_id = (SELECT id FROM categories WHERE slug = 'mens-clothing')), 4.5);
END $$;

DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    order1_id UUID;
    order2_id UUID;
    product1_id UUID;
    product2_id UUID;
BEGIN
    SELECT id INTO user1_id FROM users WHERE username = 'ivan_petrov';
    SELECT id INTO user2_id FROM users WHERE username = 'maria_s';
    SELECT id INTO product1_id FROM products WHERE name = 'Классическая футболка' LIMIT 1;
    SELECT id INTO product2_id FROM products WHERE name = 'Слим джинсы' LIMIT 1;
    
    INSERT INTO orders (id, user_id, total_amount, status, payment_method, payment_status, shipping_address, shipping_phone) VALUES
    (gen_random_uuid(), user1_id, 119.98, 'delivered', 'card', 'paid', 'Москва, ул. Тверская, д. 15, кв. 48', '+7 (999) 123-45-67') RETURNING id INTO order1_id;
    
    INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES
    (order1_id, product1_id, 2, 29.99),
    (order1_id, product2_id, 1, 89.99);
    
    INSERT INTO orders (id, user_id, total_amount, status, payment_method, payment_status, shipping_address, shipping_phone) VALUES
    (gen_random_uuid(), user2_id, 199.99, 'shipped', 'online', 'paid', 'Санкт-Петербург, Невский пр., д. 25', '+7 (999) 234-56-78') RETURNING id INTO order2_id;
    
    INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES
    (order2_id, (SELECT id FROM products WHERE name = 'Кожаная куртка'), 1, 199.99);
        INSERT INTO orders (id, user_id, total_amount, status, payment_method, payment_status, shipping_address, shipping_phone) VALUES
    (gen_random_uuid(), user1_id, 139.98, 'processing', 'card', 'pending', 'Москва, ул. Тверская, д. 15, кв. 48', '+7 (999) 123-45-67');
END $$;

DO $$
DECLARE
    product_id UUID;
    user_id UUID;
BEGIN
    SELECT id INTO product_id FROM products WHERE name = 'Классическая футболка' LIMIT 1;
    SELECT id INTO user_id FROM users WHERE username = 'ivan_petrov';
    
    INSERT INTO reviews (user_id, product_id, rating, comment, is_approved) VALUES
    (user_id, product_id, 5, 'Отличная футболка! Качество на высоте, сидит идеально.', TRUE),
    ((SELECT id FROM users WHERE username = 'maria_s'), product_id, 4, 'Хорошая футболка, но размер великоват.', TRUE);
END $$;

INSERT INTO cart_items (user_id, product_id, quantity) VALUES
((SELECT id FROM users WHERE username = 'ivan_petrov'), (SELECT id FROM products WHERE name = 'Худи с капюшоном'), 1),
((SELECT id FROM users WHERE username = 'maria_s'), (SELECT id FROM products WHERE name = 'Рубашка поло'), 2);

INSERT INTO wishlist (user_id, product_id) VALUES
((SELECT id FROM users WHERE username = 'ivan_petrov'), (SELECT id FROM products WHERE name = 'Спортивные кроссовки')),
((SELECT id FROM users WHERE username = 'maria_s'), (SELECT id FROM products WHERE name = 'Кожаная куртка'));