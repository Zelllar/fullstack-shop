CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT
);

CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1
);

INSERT INTO products (title, price, image) VALUES
('Ноутбук', 75000, 'https://via.placeholder.com/200'),
('Смартфон', 50000, 'https://via.placeholder.com/200'),
('Наушники', 8000, 'https://via.placeholder.com/200'),
('Клавиатура', 6000, 'https://via.placeholder.com/200');