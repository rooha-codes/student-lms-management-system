const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // =========================
    // ✅ GET AUTH HEADER
    // =========================
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    // ❌ No header
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

    // =========================
    // ✅ EXTRACT TOKEN
    // =========================
    const token = authHeader.split(" ")[1]?.trim();

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    // =========================
    // ✅ SECRET KEY
    // =========================
    const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

    // =========================
    // ✅ VERIFY TOKEN
    // =========================
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("TOKEN VERIFIED:", decoded);

    // =========================
    // ✅ SAVE USER DATA
    // =========================
    req.user = decoded;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    // ❌ Expired token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again",
      });
    }

    // ❌ Invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // ❌ Generic auth failure
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};

module.exports = auth;