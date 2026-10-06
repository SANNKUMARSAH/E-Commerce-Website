const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        oldPrice: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        image: {
            type: String,
            required: true
        },

        shortDescription: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        highlights: {
            type: [String],
            default: []
        },

        brand: {
            type: String,
            default: ""
        },

        color: {
            type: String,
            default: ""
        },

        warranty: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        reviews: {
            type: Number,
            default: 0,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;