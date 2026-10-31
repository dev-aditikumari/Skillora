const User = require("../models/User")
const OTP = require("../models/OTP");
const otpGenerator =require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender")
const { getAuthCookieOptions } = require("../utils/authCookie");
const OTPTemplate = require("../mail/templates/emailVerificationTemplate");
const crypto = require("crypto");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_OTP_ATTEMPTS = 5;

const normalizeEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const isStrongPassword = (password) =>
  typeof password === "string" && password.length >= 8 && password.length <= 128 &&
  /[A-Za-z]/.test(password) && /\d/.test(password);

exports.sendOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address" });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: "User already registered" });
    }

    await OTP.deleteMany({ email });
    const otp = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
    const record = await OTP.create({ email, otp });

    try {
      await mailSender(email, "Your Skillora verification code", OTPTemplate(otp));
    } catch (mailError) {
      console.error("OTP email failed:", mailError.message);
      await OTP.deleteOne({ _id: record._id });
      return res.status(503).json({
        success: false,
        message: "We could not send the verification email. Please try again shortly.",
      });
    }

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Unable to send OTP. Please try again." });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, password, confirmPassword, accountType, otp } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (![firstName, lastName, password, confirmPassword, otp].every((v) => typeof v === "string")) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include a letter and a number",
      });
    }
    if (!["Student", "Instructor"].includes(accountType)) {
      return res.status(400).json({ success: false, message: "Invalid account type" });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({ success: false, message: "OTP expired or not found. Request a new one." });
    }
    if (recentOtp.attempts >= MAX_OTP_ATTEMPTS) {
      await OTP.deleteMany({ email });
      return res.status(429).json({ success: false, message: "Too many wrong attempts. Request a new OTP." });
    }
    const given = Buffer.from(otp.trim());
    const expected = Buffer.from(recentOtp.otp);
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
      recentOtp.attempts += 1;
      await recentOtp.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({ gender: null, dob: null, about: null, contactNumber: null });
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    });
    await OTP.deleteMany({ email });

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Invalid details provided" });
    }
    return res.status(500).json({ success: false, message: "User cannot be registered. Please try again." });
  }
};

exports.logIn = async(req , res)=>{
    try{
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    if(!email || typeof password !== "string" || !password){
        return res.status(400).json({success: false , message:"All fields are required"});

    }
    const user =await User.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({success: false , message:"Invalid email or password"});
    }
    if(user.active === false){
        return res.status(403).json({success: false , message:"This account has been deactivated"});
    }
    const match = await bcrypt.compare(password , user.password);
    if(!match){
        return res.status(401).json({success: false , message:"Invalid email or password"});
    }
    const payload = {email : user.email , id: user._id , accountType: user.accountType};
    const token = jwt.sign(payload , process.env.JWT_SECRET,{expiresIn: "3d"} );

    user.password = undefined;

    const options = {
        ...getAuthCookieOptions(),
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
    res.cookie("token", token, options).status(200).json({ success: true, token, user, message: "Logged in successfully" });

}
catch(err){
    console.error(err);
    return res.status(500).json({success: false , message:"Something went wrong while logging in"})
}

}

exports.changePassword = async(req , res)=>{

  try {
 const oldpassword = req.body.oldpassword;
    const newpassword =  req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;
   
    
    
    if(!oldpassword){
 return res.status(400).json({success: false ,message:"All fields are required"});
    }
     if(!newpassword || !confirmpassword){
        return res.status(400).json({success: false ,message:"All fields are required"});
    }
  if(newpassword !== confirmpassword){
        return res.status(400).json({success : false , message:"Confirm password does not match the new password"})
    }

if(!confirmpassword || !newpassword){
       return res.status(400).json({success: false ,message:"Passwords do not match"});
    }
    if(!isStrongPassword(newpassword)){
        return res.status(400).json({success: false , message:"Password must be at least 8 characters and include a letter and a number"})
    }
    if(newpassword === oldpassword){
        return res.status(400).json({success : false , message:"New password must be different"})
    }

const user = await User.findById(req.user.id).select("+password");
if(!user){
    return res.status(404).json({success: false , message: "No user exists with this ID"})
}
    const checkoldpassword  = await bcrypt.compare(oldpassword , user.password);
    if(!checkoldpassword){
        return res.status(401).json({success: false , message:"The old password is incorrect"})
    }

    user.password = await bcrypt.hash(newpassword , 10);
    await user.save();

       try {
        await mailSender(
            user.email,
            "Password changed successfully",
            `<p>Hi ${user.firstName}, your Skillora password was just changed.</p>`
        );
    } catch (err) {
        console.log(err);
    }

    return res.status(200).json({success: true  , message:"Password updated successfully"})
  } catch (err) {
    console.error(err);
    return res.status(500).json({success: false , message: "Could not change the password"});
  }
};

exports.logout = async( req , res)=>{
  res.clearCookie("token", getAuthCookieOptions());
  return res.status(200).json({success: true , message: "Logged out successfully"})
}

