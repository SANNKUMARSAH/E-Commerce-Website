const express = require("express");

const {
    createPayment,
    verifyPayment
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createPayment);
router.post("/verify", protect, verifyPayment);

module.exports = router;
