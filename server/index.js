const path = require("path");
require("dotenv").config({path: path.join(__dirname, "../.env")});
const express = require("express")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const database = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
const User = require("./models/User");
const Course = require("./models/Course");
const Category = require("./models/Category");
const Section = require("./models/Section");
const SubSection = require("./models/SubSection");
const RatingAndReview = require("./models/RatingAndReview");
const CourseProgress = require("./models/CourseProgress");
const OTP = require("./models/OTP");
const Payment = require("./models/Payment");
const mailSender = require("./utils/mailSender");
const otpTemplate = require("./mail/templates/emailVerificationTemplate");
const app = express();
const PORT = process.env.PORT || 4000;
const {uploadToCloudinary} = require("./utils/imageUploads");
const UserRoute = require("./routes/User");
const ProfileRoute = require("./routes/Profile");
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:"http://localhost:5173", credentials: true }));
app.use(fileUpload({ useTempFiles: true,tempFileDir:"/tmp/"}));



// Connections 
database.connect();
cloudinaryConnect();


// routes

// app.use("/api/v1/auth", useRoutes);

app.use("/api/v1/auth", UserRoute)
app.use("/api/v1/profile", ProfileRoute);
app.get("/" , (req, res)=>{
    res.json({success:true, message:"Skillora server is running"});
});
app.get("/health", (req , res)=>{
    res.json({status:"ok" , time : new Date()});
})

app.get("/test-otp", async (req, res) => {
  const otp = await OTP.create({ email: "aditikumari35355@gmail.com", otp: "987654" });
  res.json({ success: true, saved: otp });
});
app.post("/test-upload", async (req, res) => {   // ← add "async" here
  try {
    // B goes here: create a variable called file and set it to req.files.image
   if( !req.files  ||  !req.files.image) {
   return res.status(400).json({success: false , message: "File not found" });
   }
   const file = req.files.image

    // C goes here: create a variable called result and set it to
    //              await uploadToCloudinary(file, process.env.FOLDER_NAME)
    const result = await uploadToCloudinary(file , process.env.FOLDER_NAME )

    // D goes here: return res.json({ ... }) with success: true and url: result.secure_url
    return res.json({success: true , url: result.secure_url});

  } catch (err) {
    // E goes here: console.error(err)
    //              then return res.status(500).json({ ... }) with success: false and err.message
    console.error(err);
    return res.status(500).json({success: false , message: err.message });
  }
});


app.post("/echo", (req,res)=>{
    res.json({youSent:req.body});
});


app.listen(PORT ,()=>console.log(`Server is running on port ${PORT}`));