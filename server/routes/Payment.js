const express = require("express");
const router = express.Router();
const { auth, isStudent } = require("../middlewares/auth");
const { capturePayment , verifyPayment } = require("../controllers/Payment");

// TODO 1: router.post("/capture-payment", auth, isStudent, capturePayment);
router.post("/capture-payment",auth , isStudent , capturePayment);
router.post("/verify-payment", auth , isStudent , verifyPayment)

module.exports = router;