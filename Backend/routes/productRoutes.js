const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL PRODUCTS
// GET /api/products
// ==========================================
router.get("/", getProducts);


// ==========================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ==========================================
router.get("/:id", getProductById);


// ==========================================
// CREATE PRODUCT
// POST /api/products
// Login required
// ==========================================
router.post("/", protect, createProduct);


// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// Login required
// ==========================================
router.put("/:id", protect, updateProduct);


// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// Login required
// ==========================================
router.delete("/:id", protect, deleteProduct);


// ==========================================
// EXPORT
// ==========================================
module.exports = router;