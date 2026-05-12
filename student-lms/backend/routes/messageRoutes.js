const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");

// GET ALL
router.get("/", auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// SEND MESSAGE
router.post("/", auth, async (req, res) => {
  try {
    const {
      senderName,
      senderRole,
      receiverName,
      receiverRole,
      subject,
      message,
    } = req.body;

    if (
      !senderName ||
      !senderRole ||
      !receiverName ||
      !receiverRole ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newMessage = await Message.create(req.body);

    res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// MARK READ
router.put("/:id", auth, async (req, res) => {
  try {
    const msg = await Message.findByPk(req.params.id);

    if (!msg) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    await msg.update(req.body);

    res.status(200).json({
      message: "Message updated",
      msg,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message,
    });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const msg = await Message.findByPk(req.params.id);

    if (!msg) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    await msg.destroy();

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
});

module.exports = router;