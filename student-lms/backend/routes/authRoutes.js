// backend/routes/authRoutes.js
// ✅ SIMPLE WORKING VERSION (same like your old setup + token added)
// Replace FULL file

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// ======================================
// 🔹 SIGNUP
// ======================================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ Save EXACT password (No bcrypt)
    // Because your old database was working this way
    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role || "student",
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful ✅",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ======================================
// 🔹 LOGIN
// ======================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ✅ Old style login (email + password direct)
    const user = await User.findOne({
      where: {
        email: email.trim().toLowerCase(),
        password: password,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ✅ JWT token
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
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ======================================
// 🔹 GET USERS
// ======================================
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

// ======================================
// 🔹 TEST ROUTE
// ======================================
router.get("/test", (req, res) => {
  res.send("Auth route working ✅");
});

module.exports = router;