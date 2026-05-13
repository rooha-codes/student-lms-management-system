// backend/server.js

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// =============================
// EXPRESS APP
// =============================
const app = express();
const server = http.createServer(app);

// =============================
// ALLOWED ORIGINS
// =============================
const allowedOrigins = [
  "http://localhost:5173",
  "https://rooha-codes.github.io",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Global socket access
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  console.log(`🔥 User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// =============================
// MIDDLEWARE
// =============================
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman/mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy blocked this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =============================
// STATIC FILES
// =============================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =============================
// ROUTES IMPORT
// =============================
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const resultRoutes = require("./routes/resultRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const messageRoutes = require("./routes/messageRoutes");
const settingRoutes = require("./routes/settingRoutes");

// =============================
// API ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/settings", settingRoutes);

// =============================
// ROOT ROUTE
// =============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 LMS Backend Running Successfully",
    port: process.env.PORT || 5001,
  });
});

// =============================
// HEALTH CHECK
// =============================
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.status(200).json({
      success: true,
      message: "Server healthy ✅",
      database: "connected",
      socket: "running",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database disconnected ❌",
      error: error.message,
    });
  }
});

// =============================
// 404 ROUTE
// =============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// =============================
// GLOBAL ERROR HANDLER
// =============================
app.use((err, req, res, next) => {
  console.error("🔥 Global Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
});

// =============================
// DATABASE + SERVER START
// =============================
const PORT = process.env.PORT || 5001;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");

    return sequelize.sync({
      alter: true,
    });
  })
  .then(() => {
    console.log("✅ Database synced successfully");

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed");
    console.error("Error:", err.message);
    console.log(
      "Check if XAMPP / MySQL service is running on port 3306."
    );

    process.exit(1);
  });
