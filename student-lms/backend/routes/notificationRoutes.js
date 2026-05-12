const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");

// GET notifications for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (err) {
    console.log("NOTIFICATION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ADD notification
router.post("/", auth, async (req, res) => {
  try {
    const { message, role = "all", userId = null } = req.body;

    const notification = await Notification.create({
      message,
      role,
      userId,
    });

    const io = req.app.get("io");
    io.emit("newNotification", notification);

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK ONE AS READ
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({ isRead: true });

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK ALL AS READ
router.put("/mark/all/read", auth, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      {
        where: {
          role: ["all", req.user.role],
        },
      }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ACTIVITY TIMELINE
router.get("/timeline", auth, async (req, res) => {
  try {
    const timeline = await Notification.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    res.json(timeline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;