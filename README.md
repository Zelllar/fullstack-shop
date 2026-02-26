# Fullstack Интернет-магазин

Полноценное fullstack-приложение интернет-магазина с клиентской частью, backend API и базой данных PostgreSQL.

## Стек технологий

Frontend:
- HTML
- CSS
- JavaScript (ES6+)
- Fetch API

Backend:
- Node.js
- Express

Database:
- PostgreSQL
- SQL (JOIN, INSERT, UPDATE, DELETE)

## Функциональность

- Получение списка товаров с сервера
- Добавление товаров в корзину
- Увеличение количества товаров
- Удаление товаров из корзины
- Очистка корзины
- Хранение данных корзины в PostgreSQL
- Клиент-серверное взаимодействие через REST API

## Архитектура

Frontend → Backend (Express) → PostgreSQL

## API

### Товары

GET /api/products
GET /api/products/:id

### Корзина

GET /api/cart
POST /api/cart
DELETE /api/cart/:id
DELETE /api/cart

## 📸 Скриншоты

![Главная страница](screenshots/main.png)
