const express = require("express");
const router = express.Router();
const { auth, isStudent } = require("../middlewares/auth");
const { createRating, getAverageRating, getAllRatings } = require("../controllers/RatingAndReview");

// TODO 1: router.post("/create-rating", auth, isStudent, createRating);
// TODO 2: router.post("/average-rating", getAverageRating);   // public
// TODO 3: router.post("/all-ratings", getAllRatings);          // public

router.post("/create-rating" , auth , isStudent, createRating);
router.post("/average-rating", getAverageRating);
router.post("/all-ratings", getAllRatings);

module.exports = router;