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
const adminRoutes = require("./routes/Admin");

const app = express();
const PORT = process.env.PORT || 4000;

// Behind a proxy in production (Render), so rate limiting sees the real client IP
app.set("trust proxy", 1);

// ---------- security and parsing ----------
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// CLIENT_URL is a comma separated allow-list. Entries may use a wildcard
// subdomain, e.g. https://*.vercel.app for preview deployments.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const originMatches = (origin, pattern) => {
  if (!pattern.includes("*")) return origin === pattern;
  const regex = new RegExp(
    "^" + pattern.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[a-z0-9-]+") + "$"
  );
  return regex.test(origin);
};

const isOriginAllowed = (origin) => {
  if (!origin) return true; // same-origin, curl, health checks
  if (process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return true;
  }
  return allowedOrigins.some((pattern) => originMatches(origin, pattern));
};

// A disallowed origin simply gets no CORS headers (the browser blocks it).
// It must not become an application error, that is what surfaced as 403.
app.use(
  cors({
    origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

// Strip Mongo operators ($where, a.b) from JSON bodies to block NoSQL injection
const sanitize = (value) => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith("$") && !key.includes("."))
        .map(([key, val]) => [key, sanitize(val)])
    );
  }
  return value;
};
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  next();
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: require("os").tmpdir(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB, for lecture videos
    abortOnLimit: true,
  })
);

// ---------- rate limiting ----------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000, // an SPA fires several calls per page and users often share an IP
  skip: (req) => req.path === "/health",
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

// login, signup, OTP, password reset: strict, stops password guessing and email spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  skipSuccessfulRequests: true, // only failed attempts (wrong password, bad OTP) count
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
});

app.use(globalLimiter);

// ---------- connections ----------
cloudinaryConnect();

// ---------- routes ----------
app.use("/api/v1/course", CourseRoute);
// each OTP sends an email, so cap those whether or not they succeed
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many verification emails requested. Please try again later." },
});

app.use("/api/v1/auth/sendotp", otpLimiter);
app.use("/api/v1/auth", authLimiter, UserRoute);
app.use("/api/v1/profile", ProfileRoute);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Skillora server is running" });
});

app.get("/health", (req, res) => {
  const dbUp = require("mongoose").connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({ status: dbUp ? "ok" : "degraded", time: new Date() });
});

// ---------- 404 and error handling (always last) ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body too large" });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Something went wrong" });
});

const requiredEnv = ["MONGODB_URL", "JWT_SECRET"];

const start = async () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
  await database.connect();
  const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(() => require("mongoose").connection.close().then(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

if (require.main === module) start();

module.exports = { app, start };