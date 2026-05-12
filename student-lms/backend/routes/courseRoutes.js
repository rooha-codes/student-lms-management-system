const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// ✅ COUNT
router.get(
  "/count/all",
  auth,
  courseController.getCoursesCount
);


// ✅ GET ALL COURSES
router.get(
  "/",
  auth,
  courseController.getCourses
);


// ✅ GET SINGLE COURSE
router.get(
  "/:id",
  auth,
  courseController.getCourseById
);


// ✅ CREATE COURSE
router.post(
  "/",
  auth,
  admin,
  courseController.createCourse
);


// ✅ UPDATE COURSE
router.put(
  "/:id",
  auth,
  admin,
  courseController.updateCourse
);


// ✅ DELETE COURSE
router.delete(
  "/:id",
  auth,
  admin,
  courseController.deleteCourse
);


module.exports = router;