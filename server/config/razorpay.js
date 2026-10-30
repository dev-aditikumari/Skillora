const Razorpay = require("razorpay");

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
const hasRazorpayCredentials = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

exports.razorpayEnabled = hasRazorpayCredentials;
exports.razorpayInstance = hasRazorpayCredentials
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;