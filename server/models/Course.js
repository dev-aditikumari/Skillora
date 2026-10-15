const mongoose = require("mongoose");

const courseSchema  = new mongoose.Schema({
   courseName :{type: String , required : true , trim : true  },
   courseDescription:{type: String , required : true , trim : true},
   instructor :{type: mongoose.Schema.Types.ObjectId , ref:"User" , required: true},
   whatYouWillLearn :[{type: String , required : true , trim : true}],
   courseContent :[{type : mongoose.Schema.Types.ObjectId , ref :"Section"}],
   ratingAndReviews : [{type : mongoose.Schema.Types.ObjectId , ref : "RatingAndReview"}],
   price:{type : Number , required: true , min: 0 },
   thumbnail : {type: String , required : true},
   tags :[{type: String , required : true , trim : true}],
   category :{type : mongoose.Schema.Types.ObjectId , ref:"Category" , required : true},
   studentsEnrolled :[{type: mongoose.Schema.Types.ObjectId , ref :"User"}],
   instructions :[{type: String , trim : true}],
   status:{type: String , enum :["Draft", "Published"] , default : "Draft"},
}, {timestamps:true});

module.exports = mongoose.model("Course" , courseSchema);