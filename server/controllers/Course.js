const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress")
const { uploadToCloudinary } = require("../utils/imageUploads");
const Payment = require("../models/Payment");
const mongoose = require("mongoose");

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, price, category, status } = req.body;
    const coursePrice = Number(price);

    const tags = JSON.parse(req.body.tags);
    const whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
    const instructions = JSON.parse(req.body.instructions);

    const thumbnail = req.files?.thumbnailImage;

    if (
      !courseName || !courseDescription || price === undefined || price === "" ||
      !Number.isFinite(coursePrice) || coursePrice < 0 ||
      !category || !thumbnail || whatYouWillLearn.length === 0
    ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const uploadedThumbnail = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: req.user.id,
      whatYouWillLearn,
      price: coursePrice,
      tags,
      category,
      instructions,
      thumbnail: uploadedThumbnail.secure_url,
      status: status || "Draft",
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { courses: newCourse._id } });
    await Category.findByIdAndUpdate(category, { $push: { courses: newCourse._id } });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to create course" });
  }
};

const getPopulatedCourse = (courseId) =>
  Course.findById(courseId).populate({
    path: "courseContent",
    populate: { path: "subSection" },
  });

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({ success: false, message: "Section name and course id are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own courses" });
    }

    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({ success: false, message: "Price must be a non-negative number" });
      }
      course.price = price;
    }

    const newSection = await Section.create({ sectionName });
    await Course.findByIdAndUpdate(courseId, { $push: { courseContent: newSection._id } });

    const updatedCourse = await getPopulatedCourse(courseId);
    return res.status(201).json({ success: true, message: "Section created successfully", data: updatedCourse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to create section" });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({ success: false, message: "Section name and course id are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own courses" });
    }

    if (!course.courseContent.some((id) => id.toString() === sectionId)) {
      return res.status(404).json({ success: false, message: "Section not found in this course" });
    }

    const updatedSection = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
    if (!updatedSection) return res.status(404).json({ success: false, message: "Section not found" });

    const updatedCourse = await getPopulatedCourse(courseId);
    return res.status(200).json({ success: true, message: "Section updated successfully", data: updatedCourse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to update section" });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    if (!sectionId || !courseId) {
      return res.status(400).json({ success: false, message: "Section id and course id are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own courses" });
    }

    if (!course.courseContent.some((id) => id.toString() === sectionId)) {
      return res.status(404).json({ success: false, message: "Section not found in this course" });
    }

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    await SubSection.deleteMany({ _id: { $in: section.subSection } });
    await Course.findByIdAndUpdate(courseId, { $pull: { courseContent: sectionId } });
    await Section.findByIdAndDelete(sectionId);

    const updatedCourse = await getPopulatedCourse(courseId);
    return res.status(200).json({ success: true, message: "Section deleted successfully", data: updatedCourse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete section" });
  }
};


exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, courseId, title, description } = req.body;
    const video = req.files?.videoFile;

    if (!courseId || !sectionId || !title || !description || !video) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own courses" });
    }

    if (!course.courseContent.some((id) => id.toString() === sectionId)) {
      return res.status(404).json({ success: false, message: "Section not found in this course" });
    }

    const uploaded = await uploadToCloudinary(video, process.env.FOLDER_NAME);

    const newSubSection = await SubSection.create({
      title,
      description,
      timeDuration: `${uploaded.duration}`,
      videoUrl: uploaded.secure_url,
    });

    await Section.findByIdAndUpdate(sectionId, { $push: { subSection: newSubSection._id } });

    const updatedCourse = await getPopulatedCourse(courseId);
    return res.status(201).json({ success: true, message: "Subsection created successfully", data: updatedCourse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to create subsection" });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, courseId, title, description } = req.body;
    if (!subSectionId || !sectionId || !courseId) {
      return res.status(400).json({ success: false, message: "Subsection id, section id and course id are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own courses" });
    }

    if (!course.courseContent.some((id) => id.toString() === sectionId)) {
      return res.status(404).json({ success: false, message: "Section not found in this course" });
    }

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    if (!section.subSection.some((id) => id.toString() === subSectionId)) {
      return res.status(404).json({ success: false, message: "Subsection not found in this section" });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) return res.status(404).json({ success: false, message: "Subsection not found" });

    if (title) subSection.title = title;
    if (description) subSection.description = description;

    const video = req.files?.videoFile;
    if (video) {
      const uploaded = await uploadToCloudinary(video, process.env.FOLDER_NAME);
      subSection.videoUrl = uploaded.secure_url;
      subSection.timeDuration = `${uploaded.duration}`;
    }

    await subSection.save();

    const updatedCourse = await getPopulatedCourse(courseId);
    return res.status(200).json({ success: true, message: "Subsection updated successfully", data: updatedCourse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to update subsection" });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, courseId } = req.body;
    if (!subSectionId || !sectionId || !courseId) {
      return res.status(400).json({ success: false, message: "Subsection id, section id and course id are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own courses" });
    }

    if (!course.courseContent.some((id) => id.toString() === sectionId)) {
      return res.status(404).json({ success: false, message: "Section not found in this course" });
    }

    const section = await Section.findById(sectionId);
    if (!section) return res.status(404).json({ success: false, message: "Section not found" });

    if (!section.subSection.some((id) => id.toString() === subSectionId)) {
      return res.status(404).json({ success: false, message: "Subsection not found in this section" });
    }

    await Section.findByIdAndUpdate(sectionId, { $pull: { subSection: subSectionId } });
    await SubSection.findByIdAndDelete(subSectionId);

    const updatedCourse = await getPopulatedCourse(courseId);
    return res.status(200).json({ success: true, message: "Subsection deleted successfully", data: updatedCourse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete subsection" });
  }
};


exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course id is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own courses" });
    }

    // Thumbnail
    const thumbnail = req.files?.thumbnailImage;
    if (thumbnail) {
      const uploaded = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);
      course.thumbnail = uploaded.secure_url;
    }

    // Category change: validate the new one first, remember the old one
    const oldCategoryId = course.category.toString();
    const newCategoryId = req.body.category;
    const categoryChanged = newCategoryId && newCategoryId !== oldCategoryId;

    if (categoryChanged) {
      const newCategory = await Category.findById(newCategoryId);
      if (!newCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
    }

    // Plain fields
    const plainFields = ["courseName", "courseDescription", "category", "status"];
    for (const key of plainFields) {
      if (req.body[key] !== undefined) course[key] = req.body[key];
    }

    // Array fields (arrive as JSON strings)
    const arrayFields = ["tags", "whatYouWillLearn", "instructions"];
    for (const key of arrayFields) {
      if (req.body[key] !== undefined) course[key] = JSON.parse(req.body[key]);
    }

    await course.save();

    // Move the course between categories
    if (categoryChanged) {
      await Category.findByIdAndUpdate(oldCategoryId, { $pull: { courses: course._id } });
      await Category.findByIdAndUpdate(newCategoryId, { $push: { courses: course._id } });
    }

    const updatedCourse = await getPopulatedCourse(courseId);
    return res.status(200).json({ success: true, message: "Course updated successfully", data: updatedCourse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to edit course" });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 })
      .populate({ path: "courseContent", populate: { path: "subSection" } });

    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch instructor courses" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course id is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own courses" });
    }

    if (course.studentsEnrolled.length > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete a course that has enrolled students" });
    }

    // Delete all sections and their subsections
    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId);
      if (section) {
        await SubSection.deleteMany({ _id: { $in: section.subSection } });
        await Section.findByIdAndDelete(sectionId);
      }
    }

    // Unlink from instructor and category
    await User.findByIdAndUpdate(course.instructor, { $pull: { courses: courseId } });
    await Category.findByIdAndUpdate(course.category, { $pull: { courses: courseId } });

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete course" });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "A valid course id is required" });
    }

    const course = await Course.findOne({ _id: courseId, status: "Published" })
      .populate({
        path: "instructor",
        select: "firstName lastName image additionalDetails",
        populate: { path: "additionalDetails", select: "about" },
      })
      .populate({
        path: "courseContent",
        populate: { path: "subSection", select: "title description timeDuration" },
      });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const courseData = course.toObject();
    courseData.studentsEnrolledCount = courseData.studentsEnrolled.length;
    delete courseData.studentsEnrolled;

    return res.status(200).json({ success: true, data: courseData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch course details" });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course id is required" });
    }

    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" }, // all fields, the player needs videoUrl
    });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrolled = course.studentsEnrolled.some((id) => id.toString() === req.user.id);
    if (!enrolled) {
      return res.status(403).json({ success: false, message: "You are not enrolled in this course" });
    }

    const progress = await CourseProgress.findOne({ courseId, userId: req.user.id });
    const completedVideos = progress ? progress.completeVideos : [];

    const courseData = course.toObject();
    delete courseData.studentsEnrolled;

    return res.status(200).json({ success: true, data: { course: courseData, completedVideos } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch course content" });
  }
};

exports.markLectureComplete = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    if (!courseId || !subSectionId) {
      return res.status(400).json({ success: false, message: "Course id and lecture id are required" });
    }

    // populate courseContent only, so section.subSection stays a list of ids
    const course = await Course.findById(courseId).populate("courseContent");
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrolled = course.studentsEnrolled.some((id) => id.toString() === req.user.id);
    if (!enrolled) {
      return res.status(403).json({ success: false, message: "You are not enrolled in this course" });
    }

    const lectureInCourse = course.courseContent.some((section) =>
      section.subSection.some((id) => id.toString() === subSectionId)
    );
    if (!lectureInCourse) {
      return res.status(404).json({ success: false, message: "Lecture not found in this course" });
    }

    const progress = await CourseProgress.findOneAndUpdate(
      { courseId, userId: req.user.id },
      { $addToSet: { completeVideos: subSectionId } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      data: { completedVideos: progress.completeVideos },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to update progress" });
  }
};

exports.getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).select(
      "courseName status price studentsEnrolled"
    );

    if (courses.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totals: { totalCourses: 0, publishedCourses: 0, totalStudents: 0, totalRevenue: 0 },
          courses: [],
        },
      });
    }

    const courseIds = courses.map((c) => c._id);

    const revenueRows = await Payment.aggregate([
      { $match: { status: "success", courses: { $in: courseIds } } },
      { $unwind: "$courses" },
      { $match: { courses: { $in: courseIds } } },
      { $group: { _id: "$courses", revenue: { $sum: "$amount" } } },
    ]);

    const revenueByCourse = {};
    for (const row of revenueRows) {
      revenueByCourse[row._id.toString()] = row.revenue;
    }

    const perCourse = courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName,
      status: course.status,
      students: course.studentsEnrolled.length,
      revenue: revenueByCourse[course._id.toString()] || 0,
    }));

    const totals = {
      totalCourses: courses.length,
      publishedCourses: courses.filter((c) => c.status === "Published").length,
      totalStudents: new Set(
        courses.flatMap((c) => c.studentsEnrolled.map(String))
      ).size,
      totalRevenue: perCourse.reduce((sum, c) => sum + c.revenue, 0),
    };

    return res.status(200).json({ success: true, data: { totals, courses: perCourse } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not fetch instructor stats" });
  }
};


exports.getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "Published" })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("courseName courseDescription price thumbnail instructor")
      .populate({ path: "instructor", select: "firstName lastName" });

    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not fetch courses" });
  }
};