// Usage: npm run seed
// Creates the admin user (from ADMIN_EMAIL / ADMIN_PASSWORD) and demo products
// (only if the products collection is empty).

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Product = require("../models/Product");

const products = [
    { name: "Wireless Headphones", category: "Electronics", price: 1999, oldPrice: 2999, image: "image/headphones.jpg", brand: "SoundMax", color: "Black", warranty: "1 Year", stock: 50, rating: 4.4, reviews: 128, shortDescription: "Bluetooth over-ear headphones with deep bass.", description: "Comfortable over-ear wireless headphones with 30 hours of battery life, deep bass and a built-in microphone for calls.", highlights: ["30 hours battery", "Bluetooth 5.0", "Built-in mic"] },
    { name: "Smart Watch", category: "Electronics", price: 2499, oldPrice: 3999, image: "image/smartwatch.jpg", brand: "FitPro", color: "Black", warranty: "1 Year", stock: 40, rating: 4.2, reviews: 96, shortDescription: "Fitness tracker with heart-rate monitor.", description: "Track steps, sleep and heart rate. Get call and message alerts on your wrist with a bright AMOLED display.", highlights: ["Heart-rate monitor", "7 day battery", "Water resistant"] },
    { name: "Smartphone", category: "Electronics", price: 14999, oldPrice: 17999, image: "image/smartphone.jpg", brand: "Nova", color: "Blue", warranty: "1 Year", stock: 25, rating: 4.3, reviews: 210, shortDescription: "6.5 inch display, 128 GB storage.", description: "A fast everyday smartphone with a 6.5 inch display, 128 GB storage and a 50 MP camera.", highlights: ["128 GB storage", "50 MP camera", "5000 mAh battery"] },
    { name: "Laptop", category: "Computers", price: 45999, oldPrice: 52999, image: "image/laptop.jpg", brand: "TechBook", color: "Silver", warranty: "2 Years", stock: 15, rating: 4.5, reviews: 74, shortDescription: "15.6 inch laptop, 16 GB RAM, 512 GB SSD.", description: "Slim and powerful laptop for work and study with a full HD display, 16 GB RAM and a fast 512 GB SSD.", highlights: ["16 GB RAM", "512 GB SSD", "Full HD display"] },
    { name: "Mechanical Keyboard", category: "Computers", price: 2999, oldPrice: 3999, image: "image/keyboard.jpg", brand: "KeyForge", color: "Black", warranty: "1 Year", stock: 60, rating: 4.6, reviews: 143, shortDescription: "RGB mechanical keyboard with blue switches.", description: "Tactile mechanical keyboard with RGB backlight and durable switches for typing and gaming.", highlights: ["Blue switches", "RGB backlight", "USB-C"] },
    { name: "DSLR Camera", category: "Electronics", price: 38999, oldPrice: 44999, image: "image/camera.jpg", brand: "Lumio", color: "Black", warranty: "2 Years", stock: 10, rating: 4.7, reviews: 58, shortDescription: "24 MP camera with 18-55 mm lens.", description: "Capture sharp photos and full HD video with this beginner-friendly DSLR camera and kit lens.", highlights: ["24 MP sensor", "18-55 mm lens", "Wi-Fi sharing"] },
    { name: "Running Shoes", category: "Fashion", price: 1799, oldPrice: 2499, image: "image/shoes.jpg", brand: "StrideX", color: "Grey", warranty: "6 Months", stock: 80, rating: 4.1, reviews: 188, shortDescription: "Lightweight shoes with cushioned sole.", description: "Breathable, lightweight running shoes with a cushioned sole for all-day comfort.", highlights: ["Breathable mesh", "Cushioned sole", "Lightweight"] },
    { name: "Travel Backpack", category: "Fashion", price: 1299, oldPrice: 1899, image: "image/backpack.jpg", brand: "Trekker", color: "Navy", warranty: "6 Months", stock: 70, rating: 4.3, reviews: 112, shortDescription: "30 L backpack with laptop compartment.", description: "Water-resistant 30 litre backpack with a padded laptop compartment and multiple pockets.", highlights: ["30 L capacity", "Laptop sleeve", "Water resistant"] }
].map((p) => ({
    ...p,
    discount: Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
}));

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (ADMIN_EMAIL && ADMIN_PASSWORD) {
            const email = ADMIN_EMAIL.toLowerCase().trim();
            const existing = await User.findOne({ email });

            if (existing) {
                if (existing.role !== "admin") {
                    existing.role = "admin";
                    await existing.save();
                }
                console.log(`Admin ready: ${email}`);
            } else {
                await User.create({
                    name: "Admin",
                    email,
                    password: await bcrypt.hash(ADMIN_PASSWORD, 10),
                    role: "admin"
                });
                console.log(`Admin created: ${email}`);
            }
        } else {
            console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set: skipping admin user");
        }

        if ((await Product.countDocuments()) === 0) {
            await Product.insertMany(products);
            console.log(`Inserted ${products.length} demo products`);
        } else {
            console.log("Products already exist: skipping demo products");
        }
    } catch (error) {
        console.error("Seed error:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
