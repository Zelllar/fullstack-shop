const pool = require("../db");

async function getProducts(req, res) {

  try {

    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Ошибка загрузки товаров" });

  }

}

module.exports = {
  getProducts
};