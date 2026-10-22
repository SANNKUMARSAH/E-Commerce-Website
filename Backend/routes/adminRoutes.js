
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Admin dashboard test
router.get("/dashboard", protect, admin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin dashboard access granted"
    });
});

module.exports = router;
