const express = require("express");
const router = express.Router();

const  {resetPassword ,resetPasswordToken} = require("../controllers/ResetPassword");

const {sendOTP , signUp , logIn , changePassword , logout }= require("../controllers/Auth")
const { auth } = require("../middlewares/auth")

router.post("/sendotp", sendOTP);
router.post("/signup",signUp);
router.post("/login", logIn);
router.post("/changepassword" , auth , changePassword);
router.post("/reset-password-token",resetPasswordToken);
router.post("/reset-password",resetPassword);
router.post("/logout",logout);
module.exports = router;