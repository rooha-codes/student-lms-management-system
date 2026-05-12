const express = require("express");
const router = express.Router();

const Schedule = require("../models/Schedule");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// GET ALL
router.get("/", auth, async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      order: [
        ["date", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch schedules",
      error: error.message,
    });
  }
});

// STATS
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const total = await Schedule.count();
    const upcoming = await Schedule.count({ where: { status: "Upcoming" } });
    const completed = await Schedule.count({ where: { status: "Completed" } });
    const cancelled = await Schedule.count({ where: { status: "Cancelled" } });

    res.status(200).json({
      total,
      upcoming,
      completed,
      cancelled,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch schedule stats",
      error: error.message,
    });
  }
});

// GET SINGLE
router.get("/:id", auth, async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch schedule",
      error: error.message,
    });
  }
});

// ADD
router.post("/", auth, admin, async (req, res) => {
  try {
    const {
      title,
      className,
      course,
      teacher,
      date,
      startTime,
      endTime,
      room,
      type,
      status,
      notes,
    } = req.body;

    if (!title || !className || !course || !teacher || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: "Title, class, course, teacher, date, start time and end time are required",
      });
    }

    const schedule = await Schedule.create({
      title,
      className,
      course,
      teacher,
      date,
      startTime,
      endTime,
      room,
      type,
      status,
      notes,
    });

    let notification = null;

    if (Notification) {
      notification = await Notification.create({
        message: `New schedule added: ${title}`,
        role: "all",
      });
    }

    const io = req.app.get("io");

    if (io && notification) {
      io.emit("newNotification", notification);
    }

    res.status(201).json({
      message: "Schedule added successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add schedule",
      error: error.message,
    });
  }
});

// UPDATE
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    await schedule.update(req.body);

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update schedule",
      error: error.message,
    });
  }
});

// DELETE
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    await schedule.destroy();

    res.status(200).json({
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete schedule",
      error: error.message,
    });
  }
});

module.exports = router;