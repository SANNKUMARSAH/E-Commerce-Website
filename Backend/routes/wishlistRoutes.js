const express = require("express");

const {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET WISHLIST
router.get("/", protect, getWishlist);

// ADD TO WISHLIST
router.post("/", protect, addToWishlist);

// REMOVE FROM WISHLIST
router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;