const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const OTPTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email :{type: String , required: true , lowercase: true , trim : true},
  otp:{type: String , required : true},
  createdAt:{type: Date , default : Date.now, expires : 60*5}  //otp will expire after 5 min
});

OTPSchema.pre("save",async function(){
    // TODO: only send when the document is NEW (not when it's updated).
  //       Hint: Mongoose documents have a property "this.isNew"
  // TODO: call mailSender with: this document's email, a subject, and otpTemplate(this document's otp)
  if(this.isNew){
    await mailSender(this.email , "Your OTP for Skillora is " , OTPTemplate(this.otp));
  }
});

module.exports = mongoose.model("OTP", OTPSchema);