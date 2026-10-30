const express = require("express");
const router = express.Router();

const { auth, isAdmin, isInstructor, isStudent } = require("../middlewares/auth");

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

const {
  createCourse,
  editCourse,
  getInstructorCourses,
  deleteCourse,
  getCourseDetails,
  createSection,
  updateSection,
  deleteSection,
  createSubSection,
  updateSubSection,
  deleteSubSection,
  getFullCourseDetails,
  markLectureComplete,
  getInstructorStats,
} = require("../controllers/Course");

// Categories
router.post("/create-category", auth, isAdmin, createCategory);
router.get("/show-all-categories", showAllCategories);
router.post("/category-page-details", categoryPageDetails);

// Courses
router.post("/create-course", auth, isInstructor, createCourse);
router.put("/edit-course", auth, isInstructor, editCourse);
router.get("/instructor-courses", auth, isInstructor, getInstructorCourses);
router.post("/delete-course", auth, isInstructor, deleteCourse);
router.post("/course-details", getCourseDetails); // public

// Sections
router.post("/add-section", auth, isInstructor, createSection);
router.put("/update-section", auth, isInstructor, updateSection);
router.post("/delete-section", auth, isInstructor, deleteSection);

// Subsections (lectures)
router.post("/add-subsection", auth, isInstructor, createSubSection);
router.put("/update-subsection", auth, isInstructor, updateSubSection);
router.post("/delete-subsection", auth, isInstructor, deleteSubSection);

router.post("/full-course-details", auth, isStudent, getFullCourseDetails);
router.post("/update-progress", auth, isStudent, markLectureComplete);
router.get("/instructor-stats", auth, isInstructor, getInstructorStats);
router.get("/published-courses", getPublishedCourses); // public

module.exports = router;