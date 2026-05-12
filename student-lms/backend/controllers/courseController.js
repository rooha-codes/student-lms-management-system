const Course = require("../models/Course");


// ✅ GET ALL COURSES
const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};


// ✅ GET SINGLE COURSE
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};


// ✅ CREATE COURSE
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      teacher,
      category,
      duration,
      studentsCount,
      status,
      image,
    } = req.body;

    // ✅ VALIDATION
    if (!title || !description || !teacher || !duration) {
      return res.status(400).json({
        message:
          "Title, description, teacher and duration are required",
      });
    }

    // ✅ CREATE
    const newCourse = await Course.create({
      title,
      description,
      teacher,
      category: category || "General",
      duration,
      studentsCount: studentsCount || 0,
      status: status || "Active",
      image: image || "",
    });

    // 🔥 SOCKET NOTIFICATION
    const io = req.app.get("io");

    if (io) {
      io.emit("newNotification", {
        message: `New course added: ${title}`,
        role: "all",
        createdAt: new Date(),
        isRead: false,
      });
    }

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
    });
  }
};


// ✅ UPDATE COURSE
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await course.update(req.body);

    // 🔥 SOCKET NOTIFICATION
    const io = req.app.get("io");

    if (io) {
      io.emit("newNotification", {
        message: `Course updated: ${course.title}`,
        role: "all",
        createdAt: new Date(),
        isRead: false,
      });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};


// ✅ DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const courseTitle = course.title;

    await course.destroy();

    // 🔥 SOCKET NOTIFICATION
    const io = req.app.get("io");

    if (io) {
      io.emit("newNotification", {
        message: `Course deleted: ${courseTitle}`,
        role: "all",
        createdAt: new Date(),
        isRead: false,
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message,
    });
  }
};


// ✅ COURSE COUNT
const getCoursesCount = async (req, res) => {
  try {
    const totalCourses = await Course.count();

    res.status(200).json({
      totalCourses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course count",
      error: error.message,
    });
  }
};


// ✅ EXPORTS FIXED
module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesCount,
};