const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const Payment = require("../models/Payment");

exports.getAdminStats = async (req, res) => {
  try {
    const [students, instructors, courses, published, categories, revenueAgg] = await Promise.all([
      User.countDocuments({ accountType: "Student" }),
      User.countDocuments({ accountType: "Instructor" }),
      Course.countDocuments(),
      Course.countDocuments({ status: "Published" }),
      Category.countDocuments(),
      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
    ]);
    return res.status(200).json({
      success: true,
      stats: {
        students,
        instructors,
        courses,
        published,
        categories,
        revenue: revenueAgg[0]?.total || 0,
        sales: revenueAgg[0]?.count || 0,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not load stats" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const filter = {};
    if (["Student", "Instructor", "Admin"].includes(req.query.accountType)) {
      filter.accountType = req.query.accountType;
    }
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("firstName lastName email accountType active image createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);
    return res.status(200).json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not load users" });
  }
};

exports.setUserActive = async (req, res) => {
  try {
    const { userId, active } = req.body;
    if (!userId || typeof active !== "boolean") {
      return res.status(400).json({ success: false, message: "userId and active are required" });
    }
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot change your own status" });
    }
    const user = await User.findByIdAndUpdate(userId, { active }, { new: true }).select("active");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, message: active ? "User activated" : "User deactivated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not update user" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select("courseName price status studentsEnrolled createdAt")
      .populate("instructor", "firstName lastName")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(200);
    return res.status(200).json({
      success: true,
      courses: courses.map((c) => ({
        _id: c._id,
        courseName: c.courseName,
        price: c.price,
        status: c.status,
        students: c.studentsEnrolled.length,
        instructor: c.instructor,
        category: c.category,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not load courses" });
  }
};
