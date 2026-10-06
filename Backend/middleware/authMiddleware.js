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

        console.log("JWT DECODED:", decoded);

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

module.exports = protect;