const express = require("express");
const router = express.Router();
const { auth, isStudent } = require("../middlewares/auth");
const { createRating, getAverageRating, getAllRatings } = require("../controllers/RatingAndReview");

router.post("/create-rating" , auth , isStudent, createRating);
router.post("/average-rating", getAverageRating);
router.post("/all-ratings", getAllRatings);

module.exports = router;