require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ---------- Required environment variables ----------
["MONGO_URI", "JWT_SECRET"].forEach((name) => {
    if (!process.env[name]) {
        console.error(`Missing required environment variable: ${name}`);
        process.exit(1);
    }
});

const app = express();

// Needed on Render/Railway so rate limiting sees the real client IP
app.set("trust proxy", 1);

// ---------- Security ----------
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const allowedOrigins = (
    process.env.CLIENT_URL ||
    "http://localhost:5500,http://127.0.0.1:5500"
)
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            // Allow tools like Postman (no origin) and listed frontends
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error("Not allowed by CORS"));
        }
    })
);

app.use(express.json({ limit: "1mb" }));

// Slow down password guessing
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again after 15 minutes."
    }
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ---------- Routes ----------
app.get("/", (req, res) => {
    res.json({ success: true, message: "ShopEase API is running" });
});

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
// ---------- 404 ----------
app.use((req, res) => {
    res.status(404).json({ success: false, message: "API route not found" });
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ success: false, message: "Origin not allowed" });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    console.error("SERVER ERROR:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "production" ? undefined : err.message
    });
});

// ---------- Start (after DB is connected) ----------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`ShopEase API running on port ${PORT}`);
    });
});
