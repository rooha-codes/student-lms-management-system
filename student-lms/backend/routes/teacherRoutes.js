const express = require("express");
const router = express.Router();

const Teacher = require("../models/Teacher");
const Notification = require("../models/Notification");

const auth = require("../middleware/authMiddleware");

// ========================================
// HELPER → SAFE SOCKET + NOTIFICATION
// ========================================
const createNotification = async (req, message, role = "admin") => {
  try {
    if (!Notification) return;

    const notification = await Notification.create({
      message,
      role,
      isRead: false,
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("newNotification", notification);
    }
  } catch (error) {
    console.log("NOTIFICATION ERROR:", error.message);
  }
};

// ========================================
// COUNT ALL TEACHERS
// ========================================
router.get("/count/all", auth, async (req, res) => {
  try {
    const count = await Teacher.count();

    return res.status(200).json({
      totalTeachers: count,
    });
  } catch (error) {
    console.log("COUNT TEACHERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch teacher count",
      error: error.message,
    });
  }
});

// ========================================
// TEACHER STATS OVERVIEW
// ========================================
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const totalTeachers = await Teacher.count();

    const activeTeachers = await Teacher.count({
      where: { status: "Active" },
    });

    const inactiveTeachers = await Teacher.count({
      where: { status: "Inactive" },
    });

    return res.status(200).json({
      totalTeachers,
      activeTeachers,
      inactiveTeachers,
    });
  } catch (error) {
    console.log("TEACHER OVERVIEW ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch teacher stats",
      error: error.message,
    });
  }
});

// ========================================
// RECENT TEACHERS
// ========================================
router.get("/recent", auth, async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return res.status(200).json(teachers);
  } catch (error) {
    console.log("RECENT TEACHERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch recent teachers",
      error: error.message,
    });
  }
});

// ========================================
// GET ALL TEACHERS
// ========================================
router.get("/", auth, async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(teachers);
  } catch (error) {
    console.log("GET TEACHERS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch teachers",
      error: error.message,
    });
  }
});

// ========================================
// GET SINGLE TEACHER
// ========================================
router.get("/:id", auth, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    return res.status(200).json(teacher);
  } catch (error) {
    console.log("GET SINGLE TEACHER ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch teacher",
      error: error.message,
    });
  }
});

// ========================================
// ADD TEACHER
// ========================================
router.post("/", auth, async (req, res) => {
  try {
    let {
      name,
      email,
      subject,
      phone,
      qualification,
      experience,
      image,
      status,
    } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    subject = subject?.trim();

    if (!name || !email || !subject) {
      return res.status(400).json({
        message: "Name, email and subject are required",
      });
    }

    const existingTeacher = await Teacher.findOne({
      where: { email },
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Teacher already exists",
      });
    }

    const teacher = await Teacher.create({
      name,
      email,
      subject,
      phone: phone?.trim() || "",
      qualification: qualification?.trim() || "",
      experience: experience?.toString().trim() || "",
      image: image?.trim() || "",
      status: status || "Active",
    });

    await createNotification(req, `New teacher added: ${teacher.name}`);

    return res.status(201).json({
      message: "Teacher added successfully",
      teacher,
    });
  } catch (error) {
    console.log("ADD TEACHER ERROR:", error);

    return res.status(500).json({
      message: "Failed to add teacher",
      error: error.message,
    });
  }
});

// ========================================
// UPDATE TEACHER
// ========================================
router.put("/:id", auth, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const updatedData = {
      ...req.body,
    };

    if (updatedData.email) {
      updatedData.email = updatedData.email.trim().toLowerCase();
    }

    if (updatedData.name) {
      updatedData.name = updatedData.name.trim();
    }

    if (updatedData.experience) {
      updatedData.experience = updatedData.experience.toString().trim();
    }

    await teacher.update(updatedData);

    await createNotification(req, `Teacher updated: ${teacher.name}`);

    return res.status(200).json({
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    console.log("UPDATE TEACHER ERROR:", error);

    return res.status(500).json({
      message: "Failed to update teacher",
      error: error.message,
    });
  }
});

// ========================================
// DELETE TEACHER
// ========================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const teacherName = teacher.name;

    await teacher.destroy();

    await createNotification(req, `Teacher removed: ${teacherName}`);

    return res.status(200).json({
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.log("DELETE TEACHER ERROR:", error);

    return res.status(500).json({
      message: "Failed to delete teacher",
      error: error.message,
    });
  }
});

module.exports = router;
