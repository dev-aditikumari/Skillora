const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/imageUploads");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const CourseProgress = require("../models/CourseProgress");
const { getAuthCookieOptions } = require("../utils/authCookie");

// UPDATE profile details
exports.updateProfile = async (req, res) => {
  try {
    // TODO 1: get dob, about, contactNumber, gender, address, city from req.body
    //         get the user id from req.user.id  (from auth middleware)
    const {dob , about , contactNumber , gender , address , city} = req.body;
    const user_id = req.user.id;
    const user = await User.findById(user_id);
     if(!user) return res.status(404).json({success: false , message:"User not found"});
    const profile = await Profile.findById(user.additionalDetails);

    // TODO 2: find the user → get user.additionalDetails (the Profile id)
    //         then find the Profile by that id
    //         (hint: User.findById, then Profile.findById(user.additionalDetails))
    
   

    // TODO 3: update only the fields that were sent.
    //         (careful: don't overwrite a field with undefined)
    //         then: await profile.save();

    if(dob !== undefined) profile.dob = dob;
    if(about !== undefined) profile.about = about;
    if(contactNumber !== undefined) profile.contactNumber  = contactNumber;
    if(gender !== undefined) profile.gender = gender;
    if(address !== undefined)profile.address = address;
    if(city !== undefined) profile.city = city;
    await profile.save();


    // TODO 4: return 200 with the updated profile
    return res.status(200).json({success: true , message: "Profile updated" , profile});
  } catch (err) { /* TODO 5 */
    console.error(err)

return res.status(500).json({success: false , message: "Unable to update the profile"})

   }
};

// DELETE account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    // An instructor's courses would be left pointing at a deleted user
    if (user.accountType === "Instructor") {
      const courseCount = await Course.countDocuments({ instructor: userId });
      if (courseCount > 0) {
        return res.status(400).json({
          success: false,
          message: "Delete your courses before deleting your account",
        });
      }
    }

    // Remove a student's traces from the courses they joined
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
// GET the logged-in user's full details
exports.getAllUserDetails = async (req, res) => {
  try {
    // TODO 10: User.findById(req.user.id).populate("additionalDetails").exec()

    const user =await  User.findById(req.user.id).populate("additionalDetails").exec();
    return res.status(200).json({success: true , message: "User details fetched" , user})
    //          return 200 with the user (no password! why isn't it there?)
  } catch (err) { /* TODO 11 */
    console.error(err);
return res.status(500).json({success: false , message: "Unable to fetch user details"})
    
  }
};

// UPDATE profile picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    // TODO 12: guard: no req.files or no req.files.displayPicture → 400
     
     if(!req.files|| !req.files.displayProfile){
      return res.status(400).json({success: false , message:"Please choose an image to upload" })
     }
     
     const files = req.files.displayProfile;
    // TODO 13: upload with your uploadToCloudinary(file, process.env.FOLDER_NAME, 1000, 1000)
    //          (the last two args are height and quality: your function handles them)

    const url = await uploadToCloudinary(files , process.env.FOLDER_NAME , 1000 , 1000);
    // TODO 14: update the user's `image` with result.secure_url
    //          hint: User.findByIdAndUpdate(id, { image: ... }, { new: true })
      const updatedUser = await User.findByIdAndUpdate(req.user.id , { image: url.secure_url },{new:true})
    // TODO 15: return 200 with the updated user
    return res.status(200).json({success: true , message:"Profile picture updated" , user: updatedUser})
  } catch (err) { /* TODO 16 */ 
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