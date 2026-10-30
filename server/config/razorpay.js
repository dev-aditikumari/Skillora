const Razorpay = require("razorpay");

// TODO 1: create and export a Razorpay instance:
//   new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
//   (use exports.razorpayInstance = ..., like your cloudinary config)
const razorpay = new Razorpay({key_id:process.env.RAZORPAY_KEY_ID , key_secret: process.env.RAZORPAY_KEY_SECRET})
exports.razorpayInstance = razorpay;