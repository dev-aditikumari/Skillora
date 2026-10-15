const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");


// 1. Auth : is the token valid?

exports.auth = async(req , res , next)=>{
    try {
    // TODO 1: get the token from ONE of these three places (use || to try each in turn):
    //   - req.cookies.token
    //   - req.body?.token
    //   - the "Authorization" header, which looks like "Bearer <token>"
    //     hint: req.header("Authorization")?.replace(???, "")
     const token = (req.cookies.token || req.body?.token || req.header("Authorization")?.replace("Bearer " , ""))
    // TODO 2: guard clause (like your upload route!):
    //   if there is no token → return 401 { success:false, message:"Token missing" }
     if(!token){
        return res.status(401).json({success: false , message:"Token missing" })
     }
    // TODO 3: verify it, in its own small try/catch:
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   save decoded on req.user
    //   if verify throws → return 401 "Token is invalid"
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decode;
       

    }
    catch(err){
        return res.status(401).json({success: false , message :"Token is invalid"})
    }
      next();
    // TODO 4: pass control on → what function do you call?
  } catch (err) {
    // TODO 5: return 500 "Something went wrong while validating the token"
    console.error(err);
    return res.status(500).json({success: false , message : "Something went wrong while validating the token"})
  }
};


// ROLE CHECKS

exports.isStudent = async( req , res ,next)=>{
    // TODO 6: if req.user.accountType is NOT "Student" → return 401
  //         "This is a protected route for Students only"
  //         otherwise → next()
  if (req.user.accountType !== "Student"){
    return res.status(403).json({success: false , message:"This is a protected route for Students only"})
  }
  next();

}
exports.isAdmin = async( req , res ,next)=>{
    // TODO 6: if req.user.accountType is NOT "Admin" → return 401
  //         "This is a protected route for Admin only"
  //         otherwise → next()
  if (req.user.accountType !== "Admin"){
    return res.status(403).json({success: false , message:"This is a protected route for Admin only"})
  }
  next();

}
exports.isInstructor = async( req , res ,next)=>{
    // TODO 6: if req.user.accountType is NOT "Instructor" → return 401
  //         "This is a protected route for Instructor only"
  //         otherwise → next()
  if (req.user.accountType !== "Instructor"){
    return res.status(403).json({success: false , message:"This is a protected route for Instructor only"})
  }
  next();

}


