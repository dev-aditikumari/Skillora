const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// STEP 1: POST /reset-password-token        { email }
//   → find the user by email
//   → make a random secret token  (crypto, built into Node)
//   → save token + expiry (now + 15 min) on the user
//   → email a link:  http://localhost:5173/update-password/<token>
//   → respond 200

// STEP 2: POST /reset-password              { token, password, confirmPassword }
//   → guards: all present, passwords match
//   → find the user BY TOKEN
//   → no user → 400 "Token is invalid"
//   → expiry passed → 400 "Token expired"
//   → hash the new password, save, clear the token and expiry
//   → respond 200

// STEP 1: generate token and email the link
exports.resetPasswordToken = async (req, res) => {
  try {
    // TODO 1: get email from req.body; if missing → 400
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if(!email) {
        return res.status(400).json({success: false , message:"Email is required"});
    }

    // TODO 2: find the user by email.
    const user = await User.findOne({email})
    //   If NO user: respond 200 with the SAME generic message you use on success
    if(!user){
       return res.status(200).json({success: true , message:"If this email is registered, a reset link has been sent"});

    }
    //   ("If this email is registered, a reset link has been sent").
    //   Why the same message? Think back to the login quiz about user enumeration.

    // TODO 3: make a random token:
    //   const token = crypto.randomBytes(20).toString("hex");
    const token = crypto.randomBytes(20).toString("hex");

    // TODO 4: save the token and an expiry on the user (what's the field name in User.js?):
    //   user.token = ...
    user.token = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = Date.now() + 15*60*1000;
    //   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;   (15 minutes, in ms)
    //   await user.save();
    await user.save();

    //   await mailSender(user.email, "Reset your Skillora password", <html with the link>);
   const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/$/, "");
   const url = `${clientUrl}/update-password/${token}`;
  await mailSender(
    user.email,
    "Reset your Skillora password",
    `<p>Hi ${user.firstName}, click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`
);

    // TODO 6: return 200 with the generic message
  return res.status(200).json({success: true , message:"If this email is registered, a reset link has been sent"});

  } catch (err) {
    // TODO 7: console.error, 500 with a string message
    console.error(err);
    return res.status(500).json({success: false ,message:"Unable to reset the password. Please try again" });
  }
};

// STEP 2: verify token and set the new password
exports.resetPassword = async (req, res) => {
  try {
    // TODO 8: get token, password, confirmPassword from req.body
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(!token || !password || !confirmPassword){
        return res.status(400).json({success: false , message:"All fields are required"});
    }

    // TODO 9: guards: any missing → 400; password !== confirmPassword → 400
if(password!==confirmPassword){
    return res.status(400).json({success: false , message:"Passwords do not match"});
}
    // TODO 10: find the user by the token:
    //   const user = await User.findOne({ token });
    //   none → 400 "Token is invalid"

    const user = await User.findOne({token: crypto.createHash("sha256").update(String(token)).digest("hex")});
    if(!user){
        return res.status(400).json({success: false , message:"Invalid or expired reset link"});
    }

    // TODO 11: expiry check:
    //   if (user.resetPasswordExpires < Date.now()) → 400 "This reset link has expired. Please request a new one"
   if(user.resetPasswordExpires < Date.now()){
    return res.status(400).json({success: false , message:"This reset link has expired. Please request a new one"})
   }
    // TODO 12: hash the new password, save it, and CLEAR the token and expiry:

    //   user.password = await bcrypt.hash(password, 10);
    //   user.token = undefined;
    //   user.resetPasswordExpires = undefined;
    //   await user.save();
   if(password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)){
    return res.status(400).json({success: false , message:"Password must be at least 8 characters and include a letter and a number"});
   }
   user.password = await bcrypt.hash(password , 10);
   user.token = undefined;
   user.resetPasswordExpires = undefined;
   await user.save();

    // TODO 13: return 200 "Password reset successfully"
    return res.status(200).json({success: true , message:"Password reset successfully"});
  } catch (err) {
    // TODO 14: console.error, 500
    console.error(err);
    return res.status(500).json({success: false , message:"Unable to reset the password. Please try again"})
  }
};
