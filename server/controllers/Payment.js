const { razorpayEnabled, razorpayInstance } = require("../config/razorpay");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const crypto = require("crypto");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");

exports.capturePayment = async (req, res) => {
  try {
    if (!razorpayEnabled) {
      return res.status(503).json({
        success: false,
        message: "Payments are not configured yet",
      });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course id is required" });
    }

    const course = await Course.findById(courseId);
    if (!course || course.status !== "Published") {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const alreadyEnrolled = course.studentsEnrolled.some(
      (id) => id.toString() === req.user.id
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: "You are already enrolled in this course" });
    }

    if (course.price === 0) {
      return res.status(400).json({ success: false, message: "Free courses are not supported yet" });
    }

    const amount = course.price * 100; // paise, from the database

    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    await Payment.create({
      user: req.user.id,
      courses: [courseId],
      amount: course.price,
      orderId: order.id,
      status: "created",
    });

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        courseName: course.courseName,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Could not initiate order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    if (!razorpayEnabled) {
      return res.status(503).json({
        success: false,
        message: "Payments are not configured yet",
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment details are required" });
    }

    const payment = await Payment.findOne({ orderId: razorpay_order_id, user: req.user.id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (payment.status === "success") {
      return res.status(200).json({ success: true, message: "Already enrolled" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);
    const isValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    payment.status = "success";
    payment.paymentId = razorpay_payment_id;
    await payment.save();

    // Enroll the student in every course on this payment
    for (const courseId of payment.courses) {
      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { studentsEnrolled: req.user.id },
      });

      let progress = await CourseProgress.findOne({ courseId, userId: req.user.id });
      if (!progress) {
        progress = await CourseProgress.create({
          courseId,
          userId: req.user.id,
          completeVideos: [],
        });
      }

      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { courses: courseId, courseProgress: progress._id },
      });
    }

    // The email must never undo a successful purchase
    try {
      const user = await User.findById(req.user.id);
      await mailSender(
        user.email,
        "Enrollment confirmed",
        `<p>Hi ${user.firstName}, you're now enrolled. Happy learning!</p>`
      );
    } catch (mailError) {
      console.error("Enrollment email failed:", mailError);
    }

    return res.status(200).json({ success: true, message: "Payment verified. You are enrolled!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};