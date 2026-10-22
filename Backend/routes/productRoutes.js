const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

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
// Admin only
// ==========================================
router.post("/", protect, admin, createProduct);


// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// Admin only
// ==========================================
router.put("/:id", protect, admin, updateProduct);


// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// Admin only
// ==========================================
router.delete("/:id", protect, admin, deleteProduct);


// ==========================================
// EXPORT
// ==========================================
module.exports = router;