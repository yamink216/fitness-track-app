const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    console.log("AUTH MIDDLEWARE RUNNING");

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        console.log("NO AUTHORIZATION HEADER");

        return res.status(401).json({
            message: "Not authorized. No token provided."
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        console.log("INVALID AUTHORIZATION FORMAT");

        return res.status(401).json({
            message: "Not authorized. Invalid authorization format."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Not authorized. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("JWT VERIFIED");

        req.userId = decoded.userId;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            message: "Not authorized. Invalid or expired token."
        });
    }
};

module.exports = protect;