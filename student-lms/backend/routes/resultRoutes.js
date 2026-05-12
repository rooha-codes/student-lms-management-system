const express = require("express");
const router = express.Router();

const Result = require("../models/Result");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ======================
// HELPERS
// ======================
const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const calculateStatus = (percentage) => {
  return percentage >= 50 ? "Pass" : "Fail";
};

// ======================
// STATS
// ======================
router.get("/stats/overview", auth, async (req, res) => {
  try {
    const totalResults = await Result.count();
    const passed = await Result.count({ where: { status: "Pass" } });
    const failed = await Result.count({ where: { status: "Fail" } });

    const allResults = await Result.findAll();

    const averagePercentage =
      allResults.length > 0
        ? (
            allResults.reduce(
              (sum, item) => sum + Number(item.percentage || 0),
              0
            ) / allResults.length
          ).toFixed(1)
        : 0;

    res.status(200).json({
      totalResults,
      passed,
      failed,
      averagePercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch result stats",
      error: error.message,
    });
  }
});

// ======================
// GET ALL
// ======================
router.get("/", auth, async (req, res) => {
  try {
    const results = await Result.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch results",
      error: error.message,
    });
  }
});

// ======================
// GET SINGLE
// ======================
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch result",
      error: error.message,
    });
  }
});

// ======================
// ADD RESULT
// ======================
router.post("/", auth, admin, async (req, res) => {
  try {
    const {
      studentName,
      className,
      course,
      subject,
      marksObtained,
      totalMarks,
      remarks,
    } = req.body;

    if (
      !studentName ||
      !className ||
      !course ||
      !subject ||
      marksObtained === "" ||
      marksObtained === undefined ||
      !totalMarks
    ) {
      return res.status(400).json({
        message:
          "Student name, class, course, subject, marks and total marks are required",
      });
    }

    const percentage =
      (Number(marksObtained) / Number(totalMarks)) * 100;

    const grade = calculateGrade(percentage);
    const status = calculateStatus(percentage);

    const result = await Result.create({
      studentName,
      className,
      course,
      subject,
      marksObtained,
      totalMarks,
      percentage: percentage.toFixed(1),
      grade,
      status,
      remarks,
    });

    let notification = null;

    if (Notification) {
      notification = await Notification.create({
        message: `Result added for ${studentName}: ${grade}`,
        role: "all",
      });
    }

    const io = req.app.get("io");

    if (io && notification) {
      io.emit("newNotification", notification);
    }

    res.status(201).json({
      message: "Result added successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add result",
      error: error.message,
    });
  }
});

// ======================
// UPDATE RESULT
// ======================
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    const updatedData = { ...req.body };

    if (
      updatedData.marksObtained !== undefined &&
      updatedData.totalMarks !== undefined
    ) {
      const percentage =
        (Number(updatedData.marksObtained) /
          Number(updatedData.totalMarks)) *
        100;

      updatedData.percentage = percentage.toFixed(1);
      updatedData.grade = calculateGrade(percentage);
      updatedData.status = calculateStatus(percentage);
    }

    await result.update(updatedData);

    res.status(200).json({
      message: "Result updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update result",
      error: error.message,
    });
  }
});

// ======================
// DELETE RESULT
// ======================
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    await result.destroy();

    res.status(200).json({
      message: "Result deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete result",
      error: error.message,
    });
  }
});

module.exports = router;