const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token is missing."
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Support different ID field names
        req.user = {
            ...decoded,
            id:
                decoded.id ||
                decoded.userId ||
                decoded._id
        };

        if (!req.user.id) {

            return res.status(401).json({
                success: false,
                message: "User ID not found in token"
            });

        }

        next();

    } catch (error) {

        console.error(
            "AUTH ERROR:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
};
// Admin role check
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only."
        });
    }

    next();
};

module.exports = protect;
module.exports.adminOnly = adminOnly;

// ==========================================
// EXPORT
// ==========================================
module.exports = protect;
module.exports.adminOnly = adminOnly;

