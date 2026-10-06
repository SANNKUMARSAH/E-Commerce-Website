const express = require("express");

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Get cart
router.get("/", protect, getCart);


// Add product
router.post("/", protect, addToCart);


// Update quantity
router.put("/:productId", protect, updateCartQuantity);


// Remove product
router.delete("/:productId", protect, removeFromCart);


// Clear cart
router.delete("/", protect, clearCart);


module.exports = router;