const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender:{type: String, enum:["male","female","other"]},
    dob:{type:Date},
    about:{type: String , maxLength: 500 , trim : true},
    contactNumber:{type:String , maxLength: 15},
    address:{type:String , maxLength: 100},
    city:{type:String , maxLength: 50},
})

module.exports = mongoose.model("Profile", profileSchema);