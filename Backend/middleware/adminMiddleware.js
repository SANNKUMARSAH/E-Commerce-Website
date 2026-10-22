
const User = require("../models/User");

// Admin access check — use AFTER authMiddleware
const admin = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId).select("role");

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = admin;
