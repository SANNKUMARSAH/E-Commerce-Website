const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");


// ==========================================
// GET WISHLIST
// GET /api/wishlist
// ==========================================
const getWishlist = async (req, res) => {
    try {
        console.log("GET WISHLIST");
        console.log("User:", req.user);

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        let wishlist = await Wishlist.findOne({
            user: userId
        }).populate("items.product");

        // Create empty wishlist if not found
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                items: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: wishlist
        });

    } catch (error) {
        console.error("GET WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// ADD TO WISHLIST
// POST /api/wishlist
// ==========================================
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let wishlist = await Wishlist.findOne({
            user: req.user.id
        });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                items: [
                    {
                        product: productId
                    }
                ]
            });

            await wishlist.populate("items.product");

            return res.status(201).json({
                success: true,
                message: "Product added to wishlist",
                wishlist
            });
        }

        const alreadyExists = wishlist.items.some(
            item => item.product.toString() === productId
        );

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Product already exists in wishlist"
            });
        }

        wishlist.items.push({
            product: productId
        });

        await wishlist.save();

        await wishlist.populate("items.product");

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            wishlist
        });

    } catch (error) {
        console.error("ADD WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:productId
// ==========================================
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({
            user: req.user.id
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        const itemExists = wishlist.items.some(
            item => item.product.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        wishlist.items = wishlist.items.filter(
            item => item.product.toString() !== productId
        );

        await wishlist.save();

        await wishlist.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist
        });

    } catch (error) {
        console.error("REMOVE WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};