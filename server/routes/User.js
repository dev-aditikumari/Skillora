const express = require("express");
const router = express.Router();


const  {resetPassword ,resetPasswordToken} = require("../controllers/ResetPassword");


// TODO 8: import sendOTP from ../controllers/Auth (named export → which brackets?)
const {sendOTP , signUp , logIn , changePassword , logout }= require("../controllers/Auth")
const { auth } = require("../middlewares/auth")
// TODO 9: router.post("/sendotp", ???);

router.post("/sendotp", sendOTP);
router.post("/signup",signUp);
router.post("/login", logIn);
router.post("/changepassword" , auth , changePassword);
router.post("/reset-password-token",resetPasswordToken);
router.post("/reset-password",resetPassword);
router.post("/logout",logout);
module.exports = router;