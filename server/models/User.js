const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName:{type: String ,trim: true, maxLength : 50 , required: true},
    lastName :{type: String , trim: true, maxLength : 50 , required: true},
    email:{type : String , required : true ,unique: true , trim: true , lowercase: true},
    password:{required : true , type : String  , select : false},
    accountType :{type: String , enum :["Student", "Instructor","Admin"] , default :"Student"},
    active:{type: Boolean , default : true},
    additionalDetails:{type: mongoose.Schema.Types.ObjectId , ref:"Profile" , required : true},
    courses :[{type: mongoose.Schema.Types.ObjectId, ref:"Course"}],
    courseProgress :[{type: mongoose.Schema.Types.ObjectId, ref:"CourseProgress"}],
    image:{type: String},
    token:{type: String},
    resetPasswordExpires:{type: Date},
   
},{timestamps:true});


module.exports = mongoose.model("User", userSchema);