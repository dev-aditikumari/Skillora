const express = require("express");
const router = express.Router();
const {auth , isStudent} = require("../middlewares/auth");
const {updateProfile , updateDisplayPicture , deleteAccount, getAllUserDetails, getEnrolledCourses} = require("../controllers/Profile");



router.put("/updateprofile", auth , updateProfile);
router.delete("/delete-profile" , auth , deleteAccount);
router.get("/get-user-details", auth , getAllUserDetails);
router.put("/update-display-picture" , auth , updateDisplayPicture);
router.get("/enrolled-courses",auth , isStudent, getEnrolledCourses);


module.exports = router;
