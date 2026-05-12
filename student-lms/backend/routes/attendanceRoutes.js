const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// COUNT / STATS
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const total = await Attendance.count();
    const present = await Attendance.count({ where: { status: "Present" } });
    const absent = await Attendance.count({ where: { status: "Absent" } });
    const late = await Attendance.count({ where: { status: "Late" } });

    res.json({ total, present, absent, late });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance stats",
      error: error.message,
    });
  }
});

// GET ALL
router.get("/", auth, async (req, res) => {
  try {
    const records = await Attendance.findAll({
      order: [["date", "DESC"], ["createdAt", "DESC"]],
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
});

// GET SINGLE
router.get("/:id", auth, async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch record",
      error: error.message,
    });
  }
});

// ADD
router.post("/", auth, admin, async (req, res) => {
  try {
    const { studentName, className, course, date, status, remarks } = req.body;

    if (!studentName || !className || !course || !date || !status) {
      return res.status(400).json({
        message: "Student, class, course, date and status are required",
      });
    }

    const record = await Attendance.create({
      studentName,
      className,
      course,
      date,
      status,
      remarks,
    });

    let notification = null;

    if (Notification) {
      notification = await Notification.create({
        message: `Attendance marked for ${studentName}: ${status}`,
        role: "all",
      });
    }

    const io = req.app.get("io");

    if (io && notification) {
      io.emit("newNotification", notification);
    }

    res.status(201).json({
      message: "Attendance added successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add attendance",
      error: error.message,
    });
  }
});

// UPDATE
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await record.update(req.body);

    res.json({
      message: "Attendance updated successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update attendance",
      error: error.message,
    });
  }
});

// DELETE
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const record = await Attendance.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    await record.destroy();

    res.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete attendance",
      error: error.message,
    });
  }
});

module.exports = router;