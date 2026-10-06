require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// =========================
// ROUTES
// =========================
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// =========================
// APP
// =========================
const app = express();

// =========================
// DATABASE
// =========================
connectDB();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// =========================
// HOME ROUTE
// =========================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "E-Commerce Backend API is running..."
    });
});

// =========================
// HEALTH CHECK
// =========================
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server and API are working properly"
    });
});

// =========================
// AUTHENTICATION ROUTES
// =========================
app.use("/api/auth", authRoutes);

// =========================
// PRODUCT ROUTES
// =========================
app.use("/api/products", productRoutes);

// =========================
// CART ROUTES
// =========================
app.use("/api/cart", cartRoutes);

// =========================
// ORDER ROUTES
// =========================
app.use("/api/orders", orderRoutes);

// =========================
// WISHLIST ROUTES
// =========================
app.use("/api/wishlist", wishlistRoutes);

// =========================
// 404 ROUTE
// =========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// =========================
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`E-Commerce Backend Started`);
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
    console.log(`=================================`);
});