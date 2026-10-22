
const express = require("express");

const {
    registerUser,
    loginUser,
    getMe
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Customer Registration
router.post("/register", registerUser);

// Customer Login
router.post("/login", loginUser);

// Protected User Profile
router.get("/me", protect, getMe);

module.exports = router;
