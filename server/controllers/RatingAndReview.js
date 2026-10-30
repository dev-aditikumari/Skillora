const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    if (!courseId || !rating || !review) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const ratingNumber = Number(rating);
    if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({ success: false, message: "Rating must be a whole number between 1 and 5" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrolled = course.studentsEnrolled.some((id) => id.toString() === req.user.id);
    if (!enrolled) {
      return res.status(403).json({ success: false, message: "Only enrolled students can review this course" });
    }

    const existing = await RatingAndReview.findOne({ user: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already reviewed this course" });
    }

    const newRating = await RatingAndReview.create({
      user: req.user.id,
      course: courseId,
      rating: ratingNumber,
      review,
    });

    await Course.findByIdAndUpdate(courseId, { $push: { ratingAndReviews: newRating._id } });

    return res.status(201).json({ success: true, message: "Review added", data: newRating });
  } catch (err) {
    // the unique index catches two requests that arrive at the same moment
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already reviewed this course" });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not add review" });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course id is required" });
    }

    const result = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ success: true, data: { averageRating: 0, count: 0 } });
    }

    return res.status(200).json({
      success: true,
      data: {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        count: result[0].count,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not fetch rating" });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course id is required" });
    }

    const reviews = await RatingAndReview.find({ course: courseId })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "firstName lastName image" });

    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not fetch reviews" });
  }
};