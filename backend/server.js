const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const pool = require("./db");

app.use(cors());
app.use(express.json());

let cart = [];

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.get("/api/cart", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          cart_items.product_id AS id,
          products.title,
          products.price,
          products.image,
          cart_items.quantity
        FROM cart_items
        JOIN products 
          ON cart_items.product_id = products.id
        `);
      res.json(result.rows);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.post("/api/cart", async (req, res) => {
  const { productId } = req.body;

  try {

    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE product_id = $1",
      [productId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = $1",
        [productId]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (product_id, quantity) VALUES ($1, 1)",
        [productId]
      );
    }

    res.json({ message: "ОК"});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await pool.query(
      "DELETE FROM cart_items WHERE product_id = $1",
      [id]
    );

    res.json({ message: "Удалено" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.delete("/api/cart", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart_items");
    res.json({ message: "Корзина очищена" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});