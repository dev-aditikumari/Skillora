const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/imageUploads");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const CourseProgress = require("../models/CourseProgress");
const { getAuthCookieOptions } = require("../utils/authCookie");

exports.updateProfile = async (req, res) => {
  try {
    const {dob , about , contactNumber , gender , address , city} = req.body;
    const user_id = req.user.id;
    const user = await User.findById(user_id);
     if(!user) return res.status(404).json({success: false , message:"User not found"});
    const profile = await Profile.findById(user.additionalDetails);

    
   

    // a blank field means "not set" (the form sends "" for an unselected gender or an empty city)
    const fields = { dob, about, contactNumber, gender, address, city };
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined) continue;
      profile[key] = typeof value === "string" && value.trim() === "" ? undefined : value;
    }
    await profile.save();

    return res.status(200).json({success: true , message: "Profile updated" , profile});
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Please check your profile details and try again" });
    }
    console.error(err);
    return res.status(500).json({success: false , message: "Unable to update the profile"})

   }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    if (user.accountType === "Instructor") {
      const courseCount = await Course.countDocuments({ instructor: userId });
      if (courseCount > 0) {
        return res.status(400).json({
          success: false,
          message: "Delete your courses before deleting your account",
        });
      }
    }

    if (user.accountType === "Student") {
      await Course.updateMany(
        { studentsEnrolled: userId },
        { $pull: { studentsEnrolled: userId } }
      );

      const reviews = await RatingAndReview.find({ user: userId }).select("_id");
      const reviewIds = reviews.map((r) => r._id);
      if (reviewIds.length > 0) {
        await Course.updateMany(
          { ratingAndReviews: { $in: reviewIds } },
          { $pull: { ratingAndReviews: { $in: reviewIds } } }
        );
        await RatingAndReview.deleteMany({ user: userId });
      }

      await CourseProgress.deleteMany({ userId });
    }

    await Profile.findByIdAndDelete(user.additionalDetails);
    await User.findByIdAndDelete(userId);

    res.clearCookie("token", getAuthCookieOptions());
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Unable to delete user" });
  }
};
exports.getAllUserDetails = async (req, res) => {
  try {

    const user =await  User.findById(req.user.id).populate("additionalDetails").exec();
    return res.status(200).json({success: true , message: "User details fetched" , user})
  } catch (err) {
    console.error(err);
return res.status(500).json({success: false , message: "Unable to fetch user details"})
    
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
     
     if(!req.files|| !req.files.displayProfile){
      return res.status(400).json({success: false , message:"Please choose an image to upload" })
     }
     
     const files = req.files.displayProfile;

    const url = await uploadToCloudinary(files , process.env.FOLDER_NAME , 1000 , 1000);
      const updatedUser = await User.findByIdAndUpdate(req.user.id , { image: url.secure_url },{new:true})
    return res.status(200).json({success: true , message:"Profile picture updated" , user: updatedUser})
  } catch (err) {
    console.error(err);
    return res.status(500).json({success: false , message :"Unable to update profile picture"})
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const loginUser = await User.findById(req.user.id).populate({
      path: "courses",
      populate: [
        { path: "instructor", select: "firstName lastName" },
        { path: "courseContent", populate: { path: "subSection", select: "title timeDuration" } },
      ],
    });

    if (!loginUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const courses = loginUser.courses.filter(Boolean);

    const progressDocs = await CourseProgress.find({
      userId: req.user.id,
      courseId: { $in: courses.map((c) => c._id) },
    });

    const progressByCourse = {};
    for (const doc of progressDocs) {
      progressByCourse[doc.courseId.toString()] = doc.completeVideos.map((id) => id.toString());
    }

    const result = courses.map((course) => {
      const courseData = course.toObject();
      const lectureIds = courseData.courseContent.flatMap((section) =>
        section.subSection.map((lecture) => lecture._id.toString())
      );
      const totalLectures = lectureIds.length;
      const done = progressByCourse[course._id.toString()] || [];
      const completedLectures = done.filter((id) => lectureIds.includes(id)).length;
      const progressPercentage =
        totalLectures === 0 ? 0 : Math.round((completedLectures / totalLectures) * 100);

      return { ...courseData, totalLectures, completedLectures, progressPercentage };
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not fetch enrolled courses" });
  }
};