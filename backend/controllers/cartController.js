const pool = require("../db");

async function getCart(req, res) {

  const userId = req.user.id;

  try {

    const result = await pool.query(
      `SELECT cart.*, products.title, products.price
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = $1`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Ошибка загрузки корзины" });

  }

}


async function addToCart(req, res) {

  const userId = req.user.id;
  const { product_id } = req.body;

  try {

    const existing = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [userId, product_id]
    );

    if (existing.rows.length > 0) {

      await pool.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2",
        [userId, product_id]
      );

    } else {

      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, 1)",
        [userId, product_id]
      );

    }

    res.json({ message: "Товар добавлен" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Ошибка добавления" });

  }

}


async function removeFromCart(req, res) {

  const userId = req.user.id;
  const product_id= req.params.product_id;

  try {

    await pool.query(
      "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
      [userId, product_id]
    );

    res.json({ message: "Удалено" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Ошибка удаления" });

  }

}

async function clearCart(req, res) {

  const userId = req.user.id;

  try {

    await pool.query(
      "DELETE FROM cart WHERE user_id = $1",
      [userId]
    );

    res.json({ message: "Корзина очищена" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Ошибка очистки корзины" });

  }

}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};