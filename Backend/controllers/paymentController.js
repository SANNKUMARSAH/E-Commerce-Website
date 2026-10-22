const crypto = require("crypto");
const Order = require("../models/Order");

const razorpayConfigured = () =>
    Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

// ==========================================
// STEP 1: CREATE A RAZORPAY ORDER
// POST /api/payment/create   { orderId }
// ==========================================
const createPayment = async (req, res) => {
    try {
        if (!razorpayConfigured()) {
            return res.status(503).json({
                success: false,
                message: "Online payments are not configured yet"
            });
        }

        const { orderId } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.userId
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.paymentMethod !== "Online") {
            return res.status(400).json({ success: false, message: "This order is not an online payment order" });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(400).json({ success: false, message: "This order is already paid" });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({ success: false, message: "This order was cancelled" });
        }

        const auth = Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64");

        // Amount is always taken from OUR database, never from the browser
        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${auth}`
            },
            body: JSON.stringify({
                amount: Math.round(order.totalAmount * 100), // paise
                currency: "INR",
                receipt: String(order._id)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Razorpay error:", data);
            return res.status(502).json({
                success: false,
                message: "Could not start payment. Please try again."
            });
        }

        order.razorpayOrderId = data.id;
        await order.save();

        res.status(200).json({
            success: true,
            keyId: process.env.RAZORPAY_KEY_ID,
            razorpayOrderId: data.id,
            amount: data.amount,
            currency: data.currency
        });
    } catch (error) {
        console.error("Create Payment Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ==========================================
// STEP 2: VERIFY THE PAYMENT SIGNATURE
// POST /api/payment/verify
// { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// ==========================================
const verifyPayment = async (req, res) => {
    try {
        if (!razorpayConfigured()) {
            return res.status(503).json({ success: false, message: "Online payments are not configured yet" });
        }

        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.userId
        });

        if (!order || order.razorpayOrderId !== razorpay_order_id) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Already verified earlier: safe to answer success again
        if (order.paymentStatus === "Paid") {
            return res.status(200).json({ success: true, message: "Payment already verified", order });
        }

        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const a = Buffer.from(expected);
        const b = Buffer.from(String(razorpay_signature));

        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        order.paymentStatus = "Paid";
        order.paymentId = razorpay_payment_id;

        if (order.orderStatus === "Pending") {
            order.orderStatus = "Confirmed";
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment successful",
            order
        });
    } catch (error) {
        console.error("Verify Payment Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { createPayment, verifyPayment };
