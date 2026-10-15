const User = require("../models/User")
const OTP = require("../models/OTP");
const otpGenerator =require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender")
exports.sendOTP = async (req , res)=>{
    try{
        // TODO 1: get email from req.body
        const email = req.body.email;

    // TODO 2: guard: no email → return 400 "Email is required"
    if(!email){
        return res.status(400).json({success: false, message: "Email is required" });
    }

    // TODO 3: does a user with this email already exist?
    //         hint: await User.findOne({ ??? })
    //         if yes → return 409 "User already registered"
    const UserAlready = await User.findOne({email});
    if(UserAlready){
        return res.status(409).json({success: false  , message: "User already registered"});
    }

    // TODO 4: generate a 6-digit, numbers-only OTP:
    //   otpGenerator.generate(6, {
    //     upperCaseAlphabets: ???, lowerCaseAlphabets: ???, specialChars: ???
    //   })

     const otp = otpGenerator.generate(6,{
        upperCaseAlphabets : null , lowerCaseAlphabets:null , specialChars: null
    })

    // TODO 5: save it → await OTP.create({ ... })   (this triggers the email!)
    const optSend = await  OTP.create({email , otp });
    // TODO 6: return 200 { success: true, message: "OTP sent successfully" }
    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    // TODO 7: console.error, then return 500 with a clear string message
    console.error(err);
    return res.status(500).json({ success:false,message:"Unable to generate OTP because of internal issue "})
  }
}

// Client sends { firstName, lastName, email, password, confirmPassword, accountType, otp }
//   → validate all fields present
//   → passwords match?
//   → user already exists?
//   → find the MOST RECENT OTP for this email
//   → OTP matches?
//   → hash the password (bcrypt)
//   → create an empty Profile
//   → create the User (linking additionalDetails → profile._id)
//   → respond 201


exports.signUp = async (req , res)=>{
   try{
    // TODO 1: destructure from req.body:
    //   firstName, lastName, email, password, confirmPassword, accountType, otp
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email ;
    const confirmPassword = req.body.confirmPassword;
    const accountType = req.body.accountType;
    const otp = req.body.otp;
    const password = req.body.password;

    // TODO 2: guard: if ANY of firstName, lastName, email, password,
    //         confirmPassword, otp is missing → 400 "All fields are required"
    //         (hint: use ! and || five times, or an array with .some())
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(400).json({success: false , message : "All fields are required"});

    }

    // TODO 3: guard: password !== confirmPassword → 400 "Passwords do not match"
    if(password !== confirmPassword){
        return res.status(400).json({success: false , message:"Passwords do not match"})
    }
    if(!["Student", "Instructor"].includes(accountType)){
    return res.status(400).json({success: false, message: "Invalid account type"});
}


    // TODO 4: guard: user already exists? → 409 (same as sendOTP)
     const user = await User.findOne({email});
     if(user){
        return res.status(409).json({success: false , message:"User already exists"})
     }

    // TODO 5: find the MOST RECENT otp for this email
    //   const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    //   - if recentOtp.length === 0 → 400 "OTP not found"
    //   - else if otp !== recentOtp[0].otp → 400 "Invalid OTP"

    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    if(recentOtp.length === 0 ){
        return res.status(400).json({success: false , message: "OTP not found"});

    }
    if(recentOtp[0].otp !== otp){
         return res.status(400).json({success: false , message: "Invalid OTP"});
    }


    // TODO 6: hash the password:
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   (what does the 10 mean? see quiz)

    const hashedPassword = await bcrypt.hash(password , 10);
    // TODO 7: create the Profile with empty/null fields:
    //   const profileDetails = await Profile.create({ gender: null, dob: null, about: null, contactNumber: null });
    //   (your Profile has more fields, but all are optional)
    const profileDetails = await Profile.create({gender: null , dob : null , about : null , contactNumber: null});
    // TODO 8: create the User:
    //   await User.create({
    //     firstName, lastName, email,
    //     password: hashedPassword,
    //     accountType,
    //     additionalDetails: profileDetails._id,
    //     image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    //   });
    const userSigned = await User.create({
           firstName , lastName , email , 
           password: hashedPassword,
           accountType,
           additionalDetails : profileDetails._id,
           image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    //   (the image is an auto-generated avatar from their initials)
    // TODO 9: return 201 { success: true, message: "User registered successfully" }
    //         (do NOT send back the password, not even hashed)
    return res.status(201).json({success: true , message: "User registered successfully"})
   } catch(err){
 // TODO 10: console.error, return 500 with a clear string message
   console.error(err);
   return res.status(500).json({success: false , message:"User cannot be registered. Please try again "});
   }
}


// Client sends { email, password }
//   → both present?
//   → find user by email  (.select("+password") because the model hides it!)
//   → no user → 401 "not registered"
//   → bcrypt.compare(password, user.password)
//   → wrong → 401 "Password is incorrect"
//   → right → create JWT with { email, id, accountType }  ← the payload your auth middleware reads
//   → save token in an httpOnly cookie
//   → respond 200 with the user (but WITHOUT the password)


exports.logIn = async(req , res)=>{
    try{
    const email = req.body.email ;
    const password = req.body.password;
    if(!email || !password){
        return res.status(400).json({success: false , message:"All fields are required"});

    }
    const user =await User.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({success: false , message:"Invalid email or password"});
    }
    const match = await bcrypt.compare(password , user.password);
    if(!match){
        return res.status(401).json({success: false , message:"Invalid email or password"});
    }
    const payload = {email : user.email , id: user._id , accountType: user.accountType};
    const token = jwt.sign(payload , process.env.JWT_SECRET,{expiresIn: "3d"} );

    user.password = undefined;

    const options = {expires: new Date(Date.now() + 3*24*60*60*1000), httpOnly : true };
    res.cookie("token", token, options).status(200).json({ success: true, token, user, message: "Logged in successfully" });

}
catch(err){
    console.error(err);
    return res.status(500).json({success: false , message:" Something went wrong while login"})
}

}

exports.changePassword = async(req , res)=>{

  try {
    // TODO 1: get oldPassword, newPassword, confirmNewPassword from req.body
 const oldpassword = req.body.oldpassword;
    const newpassword =  req.body.newpassword;
    const confirmpassword = req.body.confirmpassword;
   
    
    
      // TODO 2: guard: any missing → 400 "All fields are required"
    if(!oldpassword){
 return res.status(400).json({success: false ,message:"All fields are required"});
    }
     if(!newpassword || !confirmpassword){
        return res.status(400).json({success: false ,message:"All fields are required"});
    }
  if(newpassword !== confirmpassword){
        return res.status(400).json({success : false , message:" Confirm Passwords and New Password do not match"})
    }

    // TODO 3: guard: newPassword !== confirmNewPassword → 400 "Passwords do not match"
if(!confirmpassword || !newpassword){
       return res.status(400).json({success: false ,message:"Passwords do not match"});
    }
    // TODO 4: guard: newPassword === oldPassword → 400 "New password must be different"
    if(newpassword === oldpassword){
        return res.status(400).json({success : false , message:"New password must be different"})
    }

    // TODO 5: get the logged-in user:
    //   const user = await User.findById(req.user.id).select("+password");
    //   Where did req.user come from? (the auth middleware!)
    //   no user → 404
const user = await User.findById(req.user.id).select("+password");
if(!user){
    return res.status(404).json({success: false , message: "No user exist with this Id"})
}
    // TODO 6: check the OLD password with bcrypt.compare
    const checkoldpassword  = await bcrypt.compare(oldpassword , user.password);
    if(!checkoldpassword){
        return res.status(401).json({success: false , message:"The old password is incorrect"})
    }
    //   wrong → 401 "The old password is incorrect"

    // TODO 7: hash the new one and save it:
    //   user.password = await bcrypt.hash(newPassword, 10);
    //   await user.save();
    user.password = await bcrypt.hash(newpassword , 10);
    await user.save();

    // TODO 8: send a notification email with mailSender (user.email, a subject, a short html body)
    //   Think: should a failed email stop the password change? Wrap it in its own try/catch.
       try {
        await mailSender(
            user.email,
            "Password changed successfully",
            `<p>Hi ${user.firstName}, your Skillora password was just changed.</p>`
        );
    } catch (err) {
        console.log(err);
    }



    // TODO 9: return 200 { success: true, message: "Password updated successfully" }
    return res.status(200).json({success: true  , message:"Password updated successfully"})
  } catch (err) {
    // TODO 10: console.error, 500 with a string message
    console.error(err);
    return res.status(500).json({success: false , message: "Couldn't able to change password"});
  }
};

exports.logout = async( req , res)=>{
     // TODO 1: clear the "token" cookie   hint: res.clearCookie(???)
     
     res.clearCookie("token",{httpOnly:true})
  // TODO 2: return 200 { success: true, message: "Logged out successfully" }
  return res.status(200).json({success: true , message: "Logged out successfully"})
}








