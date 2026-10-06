const Product = require("../models/Product");

// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            oldPrice,
            discount,
            image,
            shortDescription,
            description,
            highlights,
            brand,
            color,
            warranty,
            rating,
            reviews,
            stock
        } = req.body;

        // Required fields
        if (
            !name ||
            !category ||
            price === undefined ||
            !image ||
            !shortDescription ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required product fields"
            });
        }

        const product = await Product.create({
            name,
            category,
            price,
            oldPrice,
            discount,
            image,
            shortDescription,
            description,
            highlights,
            brand,
            color,
            warranty,
            rating,
            reviews,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Get Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Invalid product ID",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Update Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Invalid product ID or data",
            error: error.message
        });
    }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete Product Error:", error);

        res.status(500).json({
            success: false,
            message: "Invalid product ID",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};