const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if(!email) {
        return res.status(400).json({success: false , message:"Email is required"});
    }

    const user = await User.findOne({email})
    if(!user){
       return res.status(200).json({success: true , message:"If this email is registered, a reset link has been sent"});

    }

    const token = crypto.randomBytes(20).toString("hex");

    user.token = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = Date.now() + 15*60*1000;
    await user.save();

   const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/$/, "");
   const url = `${clientUrl}/update-password/${token}`;
  await mailSender(
    user.email,
    "Reset your Skillora password",
    `<p>Hi ${user.firstName}, click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`
);

  return res.status(200).json({success: true , message:"If this email is registered, a reset link has been sent"});

  } catch (err) {
    console.error(err);
    return res.status(500).json({success: false ,message:"Unable to reset the password. Please try again" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(!token || !password || !confirmPassword){
        return res.status(400).json({success: false , message:"All fields are required"});
    }

if(password!==confirmPassword){
    return res.status(400).json({success: false , message:"Passwords do not match"});
}

    const user = await User.findOne({token: crypto.createHash("sha256").update(String(token)).digest("hex")});
    if(!user){
        return res.status(400).json({success: false , message:"Invalid or expired reset link"});
    }

   if(user.resetPasswordExpires < Date.now()){
    return res.status(400).json({success: false , message:"This reset link has expired. Please request a new one"})
   }

   if(password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)){
    return res.status(400).json({success: false , message:"Password must be at least 8 characters and include a letter and a number"});
   }
   user.password = await bcrypt.hash(password , 10);
   user.token = undefined;
   user.resetPasswordExpires = undefined;
   await user.save();

    return res.status(200).json({success: true , message:"Password reset successfully"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({success: false , message:"Unable to reset the password. Please try again"})
  }
};
