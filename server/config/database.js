const mongoose = require("mongoose")

exports.connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully");
    }catch(err){
        console.error("DB Connection failed", err.message);
        process.exit(1);
    }
};