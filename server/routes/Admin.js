const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const { getAdminStats, getAllUsers, setUserActive, getAllCourses } = require("../controllers/Admin");

router.use(auth, isAdmin);
router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.put("/user-status", setUserActive);
router.get("/courses", getAllCourses);

module.exports = router;
