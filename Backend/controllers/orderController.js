const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {
    try {
        const {
            shippingAddress,
            paymentMethod = "COD"
        } = req.body;

        // Check address
        if (
            !shippingAddress ||
            !shippingAddress.name ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping address is required"
            });
        }

        // Check payment method
        if (!["COD", "Online"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({
            user: req.user.userId
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        let subtotal = 0;
        const orderItems = [];

        // ==========================================
        // CHECK PRODUCTS & STOCK
        // ==========================================

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "One of the products no longer exists"
                });
            }

            if (!product.isActive) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is no longer available`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} item(s) available for ${product.name}`
                });
            }

            const itemSubtotal = product.price * item.quantity;

            subtotal += itemSubtotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity: item.quantity,
                subtotal: itemSubtotal
            });
        }

        // ==========================================
        // DELIVERY FEE
        // ==========================================

        const deliveryFee = subtotal >= 500 ? 0 : 50;

        const totalAmount = subtotal + deliveryFee;

        // ==========================================
        // CREATE ORDER
        // ==========================================

        const order = await Order.create({
            user: req.user.userId,
            orderItems,
            shippingAddress,
            subtotal,
            deliveryFee,
            totalAmount,
            paymentMethod,
            paymentStatus: "Pending",
            orderStatus: "Pending"
        });

        // ==========================================
        // REDUCE STOCK
        // ==========================================

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // ==========================================
        // CLEAR CART
        // ==========================================

        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET MY ORDERS
// ==========================================

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId
        })
            .populate("orderItems.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET SINGLE ORDER
// ==========================================

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        }).populate("orderItems.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Get Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// CANCEL ORDER
// ==========================================

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Only certain statuses can be cancelled
        if (
            order.orderStatus === "Shipped" ||
            order.orderStatus === "Out for Delivery" ||
            order.orderStatus === "Delivered" ||
            order.orderStatus === "Cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "This order cannot be cancelled"
            });
        }

        // Restore stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        order.orderStatus = "Cancelled";

        // If payment was already made
        if (order.paymentStatus === "Paid") {
            order.paymentStatus = "Refunded";
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        console.error("Cancel Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
};