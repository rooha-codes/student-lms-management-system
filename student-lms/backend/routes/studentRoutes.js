const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

// ======================
// 📊 COUNT
// ======================
router.get("/count/all", auth, async (req, res) => {
  try {
    const totalStudents = await Student.count();

    res.status(200).json({
      totalStudents,
    });
  } catch (error) {
    console.log("COUNT ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch student count",
      error: error.message,
    });
  }
});

// ======================
// 📈 OVERVIEW
// ======================
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const activeStudents = await Student.count({
      where: { status: "Active" },
    });

    res.status(200).json({
      totalStudents,
      activeStudents,
      inactiveStudents: totalStudents - activeStudents,
    });
  } catch (error) {
    console.log("OVERVIEW ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch overview",
      error: error.message,
    });
  }
});

// ======================
// 📊 MONTHLY STATS
// ======================
router.get("/stats/monthly", auth, async (req, res) => {
  try {
    const students = await Student.findAll();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData = months.map((month) => ({
      name: month,
      students: 0,
    }));

    students.forEach((student) => {
      const monthIndex = new Date(student.createdAt).getMonth();
      monthlyData[monthIndex].students += 1;
    });

    res.status(200).json(monthlyData);
  } catch (error) {
    console.log("MONTHLY ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch monthly stats",
      error: error.message,
    });
  }
});

// ======================
// 🆕 RECENT
// ======================
router.get("/recent", auth, async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    res.status(200).json(students);
  } catch (error) {
    console.log("RECENT ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch recent students",
      error: error.message,
    });
  }
});

// ======================
// 📤 IMAGE UPLOAD
// ======================
router.post("/upload", auth, admin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `http://localhost:5001/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

// ======================
// 📥 GET ALL
// ======================
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(students);
  } catch (error) {
    console.log("GET ALL ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});

// ======================
// 📥 GET SINGLE
// ======================
router.get("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.log("GET SINGLE ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch student",
      error: error.message,
    });
  }
});

// ======================
// ➕ ADD STUDENT
// ======================
router.post("/", auth, admin, async (req, res) => {
  try {
    const {
      name,
      email,
      className,
      age,
      gender,
      course,
      status,
      image,
      phone,
      address,
    } = req.body;

    if (!name || !email || !className || !age) {
      return res.status(400).json({
        message: "Name, email, class and age are required",
      });
    }

    const existingStudent = await Student.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    const student = await Student.create({
      name,
      email,
      className,
      age,
      gender,
      course,
      status: status || "Active",
      image,
      phone,
      address,
    });

    let notification = null;

    if (Notification) {
      notification = await Notification.create({
        message: `New student added: ${student.name}`,
        role: "all",
      });
    }

    const io = req.app.get("io");

    if (io && notification) {
      io.emit("newNotification", notification);
    }

    res.status(201).json({
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    console.log("ADD ERROR:", error);
    res.status(500).json({
      message: "Failed to add student",
      error: error.message,
    });
  }
});

// ======================
// ✏️ UPDATE
// ======================
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await student.update(req.body);

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
});

// ======================
// ❌ DELETE
// ======================
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await student.destroy();

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
});

module.exports = router;