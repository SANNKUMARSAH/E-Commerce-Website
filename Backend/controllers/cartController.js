const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ==========================================
// ADD PRODUCT TO CART
// ==========================================

const addToCart = async (req, res) => {
    try {

        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available"
            });
        }

        let cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {

            cart = await Cart.create({
                user: req.user.userId,
                items: [
                    {
                        product: productId,
                        quantity: quantity
                    }
                ]
            });

        } else {

            const existingItem = cart.items.find(
                item =>
                    item.product.toString() === productId
            );

            if (existingItem) {

                const newQuantity =
                    existingItem.quantity + quantity;

                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot add more than available stock"
                    });
                }

                existingItem.quantity = newQuantity;

            } else {

                cart.items.push({
                    product: productId,
                    quantity: quantity
                });

            }

            await cart.save();
        }

        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {

        console.error("Add To Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET CART
// ==========================================

const getCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user.userId
        }).populate("items.product");

        if (!cart) {

            return res.status(200).json({
                success: true,
                cart: {
                    items: []
                }
            });

        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        console.error("Get Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE CART QUANTITY
// ==========================================

const updateCartQuantity = async (req, res) => {

    try {

        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });

        }

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }

        if (quantity > product.stock) {

            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available`
            });

        }

        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }

        const item = cart.items.find(
            item =>
                item.product.toString() === productId
        );

        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Product is not in cart"
            });

        }

        item.quantity = quantity;

        await cart.save();

        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart
        });

    } catch (error) {

        console.error(
            "Update Cart Quantity Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

const removeFromCart = async (req, res) => {

    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }

        cart.items = cart.items.filter(
            item =>
                item.product.toString() !== productId
        );

        await cart.save();

        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        });

    } catch (error) {

        console.error(
            "Remove Cart Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// CLEAR CART
// ==========================================

const clearCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart) {

            return res.status(200).json({
                success: true,
                message: "Cart is already empty"
            });

        }

        cart.items = [];

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {

        console.error(
            "Clear Cart Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
};