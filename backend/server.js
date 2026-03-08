const express = require("express")
const cors = require("cors");


const productsRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 3000;

const pool = require("./db");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
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

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Доступ разрешён",
    user: req.user
  });
});