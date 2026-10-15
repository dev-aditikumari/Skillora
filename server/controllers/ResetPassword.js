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
    const email = req.body.email;
    if(!email) {
        return res.status(400).json({success: false , message:"Provide required credentials"});
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
    user.token = token;
    user.resetPasswordExpires = Date.now() + 15*60*1000;
    //   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;   (15 minutes, in ms)
    //   await user.save();
    await user.save();

    // TODO 5: build the link and send it:
    //   const url = `http://localhost:5173/update-password/${token}`;
    //   await mailSender(user.email, "Reset your Skillora password", <html with the link>);
   const url = `http://localhost:5173/update-password/${token}`;
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
    return res.status(500).json({success: false ,message:"Unable to reset password" });
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
        return res.status(400).json({success: false , message:"Provide complete credentials"});
    }

    // TODO 9: guards: any missing → 400; password !== confirmPassword → 400
if(password!==confirmPassword){
    return res.status(400).json({success: false , message:"Password do not match"});
}
    // TODO 10: find the user by the token:
    //   const user = await User.findOne({ token });
    //   none → 400 "Token is invalid"

    const user = await User.findOne({token});
    if(!user){
        return res.status(400).json({success: false , message:"Invalid token"});
    }

    // TODO 11: expiry check:
    //   if (user.resetPasswordExpires < Date.now()) → 400 "Token expired, please request a new one"
   if(user.resetPasswordExpires < Date.now()){
    return res.status(400).json({success: false , message:"Token expired, please request a new one"})
   }
    // TODO 12: hash the new password, save it, and CLEAR the token and expiry:

    //   user.password = await bcrypt.hash(password, 10);
    //   user.token = undefined;
    //   user.resetPasswordExpires = undefined;
    //   await user.save();
   user.password = await bcrypt.hash(password , 10);
   user.token = undefined;
   user.resetPasswordExpires = undefined;
   await user.save();

    // TODO 13: return 200 "Password reset successfully"
    return res.status(200).json({success: true , message:"Password reset successfully"});
  } catch (err) {
    // TODO 14: console.error, 500
    console.error(err);
    return res.status(500).json({success: false , message:"Unable to reset password"})
  }
};
