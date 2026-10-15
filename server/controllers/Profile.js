const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadToCloudinary } = require("../utils/imageUploads");

// UPDATE profile details
exports.updateProfile = async (req, res) => {
  try {
    // TODO 1: get dob, about, contactNumber, gender, address, city from req.body
    //         get the user id from req.user.id  (from auth middleware)
    const {dob , about , contactNumber , gender , address , city} = req.body;
    const user_id = req.user.id;
    const user = await User.findById(user_id);
     if(!user) return res.status(404).json({success: false , message:"User not found"});
    const profile = await Profile.findById(user.additionalDetails);

    // TODO 2: find the user → get user.additionalDetails (the Profile id)
    //         then find the Profile by that id
    //         (hint: User.findById, then Profile.findById(user.additionalDetails))
    
   

    // TODO 3: update only the fields that were sent.
    //         (careful: don't overwrite a field with undefined)
    //         then: await profile.save();

    if(dob !== undefined) profile.dob = dob;
    if(about !== undefined) profile.about = about;
    if(contactNumber !== undefined) profile.contactNumber  = contactNumber;
    if(gender !== undefined) profile.gender = gender;
    if(address !== undefined)profile.address = address;
    if(city !== undefined) profile.city = city;
    await profile.save();


    // TODO 4: return 200 with the updated profile
    return res.status(200).json({success: true , message: "Profile updated" , profile});
  } catch (err) { /* TODO 5 */
    console.error(err)

return res.status(500).json({success: false , message: "Unable to update profile "})

   }
};

// DELETE account
exports.deleteAccount = async (req, res) => {
  try {
    // TODO 6: get user id from req.user.id; find the user; 404 if none
    const userId = req.user.id;
    const user =await  User.findById(userId);
    if(!user)return res.status(404).json({success: false , message:"User doesnot exist"});
    // TODO 7: delete the Profile (user.additionalDetails) first, then the User
    //         hint: Profile.findByIdAndDelete(...), User.findByIdAndDelete(...)
    await Profile.findByIdAndDelete(user.additionalDetails);
    await User.findByIdAndDelete(userId);
    // TODO 8: return 200
    res.clearCookie("token",{httpOnly : true});
    return res.status(200).json({success: true , message :"User deleted successfully"});
    
    // (Later, in Step 7, we'll also remove the student from the courses they enrolled in.)
  } catch (err) { /* TODO 9 */
    console.error(err);
return res.status(500).json({success: false , message: "Unable to delete user "})

  }
};

// GET the logged-in user's full details
exports.getAllUserDetails = async (req, res) => {
  try {
    // TODO 10: User.findById(req.user.id).populate("additionalDetails").exec()

    const user =await  User.findById(req.user.id).populate("additionalDetails").exec();
    return res.status(200).json({success: true , message: "All info of user fetched" , user})
    //          return 200 with the user (no password! why isn't it there?)
  } catch (err) { /* TODO 11 */
    console.error(err);
return res.status(500).json({success: false , message: "Unable to fetch user details"})
    
  }
};

// UPDATE profile picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    // TODO 12: guard: no req.files or no req.files.displayPicture → 400
     
     if(!req.files|| !req.files.displayProfile){
      return res.status(400).json({success: false , message:"Unable to fetch file of user" })
     }
     
     const files = req.files.displayProfile;
    // TODO 13: upload with your uploadToCloudinary(file, process.env.FOLDER_NAME, 1000, 1000)
    //          (the last two args are height and quality: your function handles them)

    const url = await uploadToCloudinary(files , process.env.FOLDER_NAME , 1000 , 1000);
    // TODO 14: update the user's `image` with result.secure_url
    //          hint: User.findByIdAndUpdate(id, { image: ... }, { new: true })
      const updatedUser = await User.findByIdAndUpdate(req.user.id , { image: url.secure_url },{new:true})
    // TODO 15: return 200 with the updated user
    return res.status(200).json({success: true , message:"Updated Profile Picture" , user: updatedUser})
  } catch (err) { /* TODO 16 */ 
    console.error(err);
    return res.status(500).json({success: false , message :"Unable to update profile picture"})
  }
};
