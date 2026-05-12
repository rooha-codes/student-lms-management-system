// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // ✅ Get token from header
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    // ❌ No token
    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    // ❌ Wrong format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    // ✅ Use ENV secret OR fallback
    const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("DECODED USER:", decoded);

    // ✅ Attach user
    req.user = decoded;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again",
      });
    }

    // Invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // Generic
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};

module.exports = auth;