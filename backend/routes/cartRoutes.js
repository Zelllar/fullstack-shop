const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

router.get("/", authMiddleware, cartController.getCart);
router.post("/", authMiddleware, cartController.addToCart);
router.delete("/:product_id", authMiddleware, cartController.removeFromCart);
router.delete("/", authMiddleware, cartController.clearCart);

module.exports = router;