// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// =============================
// TEST ROUTE
// =============================
router.get("/test", (req, res) => {
  res.status(200).send("Auth route working ✅");
});

// =============================
// SIGNUP
// =============================
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful ✅",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
});

// =============================
// LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// =============================
// GET USERS
// =============================
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

module.exports = router;
