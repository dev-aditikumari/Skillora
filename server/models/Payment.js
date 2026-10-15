const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({
   user : {type: mongoose.Schema.Types.ObjectId, ref :"User" , required: true},
   courses :[{type: mongoose.Schema.Types.ObjectId , ref :"Course" , required: true}],
   amount :{type: Number , required: true , min:0},
   orderId :{type: String , required: true},
   paymentId :{type: String },
   status :{type: String , required: true , enum : ["created","pending" , "success" , "failed"] , default : "created"},

}, {timestamps:true});

module.exports = mongoose.model("Payment" , paymentSchema);