const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fileUpload = require("express-fileupload");

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Importing the models registers them with Mongoose, which populate() needs
require("./models/User");
require("./models/Profile");
require("./models/Course");
require("./models/Category");
require("./models/Section");
require("./models/SubSection");
require("./models/RatingAndReview");
require("./models/CourseProgress");
require("./models/OTP");
require("./models/Payment");

const UserRoute = require("./routes/User");
const ProfileRoute = require("./routes/Profile");
const CourseRoute = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const ratingRoutes = require("./routes/RatingAndReview");

const app = express();
const PORT = process.env.PORT || 4000;

// Behind a proxy in production (Render), so rate limiting sees the real client IP
app.set("trust proxy", 1);

// ---------- security and parsing ----------
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalDevelopmentOrigin =
        process.env.NODE_ENV !== "production" &&
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
      if (!origin || isLocalDevelopmentOrigin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB, for lecture videos
    abortOnLimit: true,
  })
);

// ---------- rate limiting ----------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

// login, signup, OTP, password reset: strict, stops password guessing and email spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
});

app.use(globalLimiter);

// ---------- connections ----------
database.connect();
cloudinaryConnect();

// ---------- routes ----------
app.use("/api/v1/course", CourseRoute);
app.use("/api/v1/auth", authLimiter, UserRoute);
app.use("/api/v1/profile", ProfileRoute);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/rating", ratingRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Skillora server is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ---------- 404 and error handling (always last) ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ success: false, message: "Origin not allowed" });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body too large" });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Something went wrong" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));