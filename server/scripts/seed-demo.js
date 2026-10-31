// Demo content for local development and demos: instructors, courses, students,
// enrollments and reviews. Safe to re-run (existing courses are skipped).
//   npm run seed:demo        (uses MONGODB_URL)
// Everything is clearly fake: accounts are *@skillora.dev.
// Locally the password is Demo1234. Against a real database (mongodb+srv) set DEMO_PASSWORD
// to a private value first, otherwise the script stops so nobody ships a publicly known login.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Category = require("../models/Category");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const RatingAndReview = require("../models/RatingAndReview");

const PASSWORD = process.env.DEMO_PASSWORD || "Demo1234";

if (/^mongodb\+srv:/.test(process.env.MONGODB_URL || "") && !process.env.DEMO_PASSWORD) {
  console.error("Refusing to seed demo users into a hosted database with the default password.");
  console.error("Run again with DEMO_PASSWORD set to a private value, for example:");
  console.error("  DEMO_PASSWORD='choose-a-private-password' npm run seed:demo");
  process.exit(1);
}
const VIDEOS = [
  "https://res.cloudinary.com/demo/video/upload/dog.mp4",
  "https://res.cloudinary.com/demo/video/upload/elephants.mp4",
];

const INSTRUCTORS = [
  ["Aarav", "Mehta"], ["Priya", "Nair"], ["Rohan", "Kapoor"], ["Sara", "Iyer"],
];
const STUDENTS = [
  ["Ananya", "Rao"], ["Kabir", "Shah"], ["Meera", "Das"], ["Dev", "Patel"], ["Ishita", "Roy"], ["Neil", "Joseph"],
];

// [category, slug, title, description, price, tags, learn[], requirements[], sections[[name,[lectures]]], instructor]
const COURSES = [
  ["Web Development", "react", "Complete React for Beginners", "Learn React from scratch: components, state, hooks and routing, by building real projects step by step.", 499,
    ["react", "javascript", "frontend"], ["Build components and manage state", "Use hooks like useState and useEffect", "Route between pages with React Router"], ["Basic HTML, CSS and JavaScript"],
    [["Getting Started", ["Welcome to the course", "Setting up your editor", "Your first component"]], ["State and Hooks", ["Props and state", "useEffect in practice"]]], 0],
  ["Web Development", "nodejs", "Node.js and Express: Build REST APIs", "Design, build and secure production-style REST APIs with Node.js, Express and MongoDB.", 699,
    ["node", "express", "mongodb", "api"], ["Create REST endpoints with Express", "Model data with MongoDB and Mongoose", "Secure routes with JWT authentication"], ["JavaScript fundamentals"],
    [["Express Basics", ["Project setup", "Routing and middleware"]], ["Data and Auth", ["MongoDB with Mongoose", "JWT authentication", "Deploying your API"]]], 0],
  ["Web Development", "css", "Modern CSS and Tailwind Masterclass", "Master layout, responsive design and Tailwind CSS to build beautiful interfaces fast.", 0,
    ["css", "tailwind", "design"], ["Lay out pages with Flexbox and Grid", "Build responsive designs", "Speed up styling with Tailwind"], ["Basic HTML"],
    [["Layout Foundations", ["Flexbox in 15 minutes", "CSS Grid essentials"]], ["Tailwind in Practice", ["Utility-first workflow", "Building a landing page"]]], 1],
  ["Data Science", "python", "Python for Data Analysis", "Go from zero to analysing real datasets with Python, pandas and visualisation libraries.", 599,
    ["python", "pandas", "data"], ["Clean and explore datasets with pandas", "Create charts that tell a story", "Answer questions with data"], ["No prior programming needed"],
    [["Python Quickstart", ["Variables and types", "Functions and loops"]], ["Working with Data", ["Pandas essentials", "Visualising results", "A mini analysis project"]]], 1],
  ["Data Science", "ml", "Machine Learning Fundamentals", "Understand how machine learning works and train your first models with scikit-learn.", 899,
    ["machine learning", "scikit-learn", "python"], ["Explain supervised and unsupervised learning", "Train and evaluate models", "Avoid overfitting"], ["Basic Python and statistics"],
    [["Core Ideas", ["What is machine learning?", "Training and testing"]], ["Your First Models", ["Linear regression", "Classification", "Evaluating models"]]], 2],
  ["Data Science", "sql", "SQL for Everyone", "Learn to query, join and summarise data with SQL, the most useful skill in analytics.", 0,
    ["sql", "databases", "analytics"], ["Write SELECT queries with confidence", "Join tables correctly", "Summarise data with GROUP BY"], ["Curiosity about data"],
    [["Querying Basics", ["SELECT and WHERE", "Sorting and limits"]], ["Going Further", ["Joins explained", "Aggregations"]]], 2],
  ["Mobile Development", "flutter", "Flutter: Build Beautiful Mobile Apps", "Create fast, good-looking Android and iOS apps from one codebase with Flutter and Dart.", 799,
    ["flutter", "dart", "mobile"], ["Build screens with widgets", "Manage app state", "Publish to the app stores"], ["Basic programming knowledge"],
    [["Flutter Basics", ["Hello Flutter", "Widgets and layout"]], ["Real Apps", ["Navigation", "State management", "Shipping your app"]]], 3],
  ["Mobile Development", "reactnative", "React Native in a Weekend", "Use your React skills to ship a real mobile app in a weekend.", 549,
    ["react native", "mobile", "javascript"], ["Set up Expo and run on a device", "Build native-feeling screens", "Fetch and show API data"], ["Basic React"],
    [["Setup", ["Expo and your first app", "Core components"]], ["Building the App", ["Lists and navigation", "Talking to an API"]]], 3],
  ["Cloud & DevOps", "docker", "Docker and Kubernetes Essentials", "Containerise applications and run them at scale with Docker and Kubernetes.", 749,
    ["docker", "kubernetes", "devops"], ["Package apps with Docker", "Run multi-container setups", "Deploy to a Kubernetes cluster"], ["Comfort with the command line"],
    [["Containers", ["Why containers?", "Writing a Dockerfile"]], ["Orchestration", ["Docker Compose", "Kubernetes basics", "Deploying a service"]]], 2],
  ["Cloud & DevOps", "aws", "AWS Cloud Practitioner Prep", "Learn core AWS services and pass the Cloud Practitioner exam with confidence.", 649,
    ["aws", "cloud", "certification"], ["Understand core AWS services", "Reason about cost and security", "Prepare for the exam"], ["No cloud experience needed"],
    [["Cloud Concepts", ["What is the cloud?", "The AWS global network"]], ["Core Services", ["Compute and storage", "Security and billing"]]], 3],
  ["UI/UX Design", "figma", "UI Design with Figma", "Design clean, usable interfaces and prototypes in Figma, from wireframe to handoff.", 0,
    ["figma", "ui", "design"], ["Design with components and auto layout", "Build interactive prototypes", "Hand designs off to developers"], ["No design experience needed"],
    [["Figma Basics", ["Tour of the interface", "Frames and auto layout"]], ["From Idea to Prototype", ["Components and variants", "Prototyping flows"]]], 1],
  ["UI/UX Design", "ux", "UX Research and Design Thinking", "Learn how to understand users, test ideas early and design products people love.", 449,
    ["ux", "research", "product"], ["Run user interviews", "Turn insights into design decisions", "Test prototypes with real users"], ["Interest in product design"],
    [["Understanding Users", ["Research methods", "Interviewing users"]], ["Designing and Testing", ["Ideation workshops", "Usability testing"]]], 0],
];

const REVIEWS = [
  [5, "Clear, practical and beginner friendly. Loved the pacing."],
  [5, "Best course on this topic I have taken. The projects made everything click."],
  [4, "Great explanations and well organised. Would love a few more exercises."],
  [5, "Worth every rupee. I built something real by the end."],
  [4, "Solid content and a friendly instructor."],
];

const upsertUser = async (firstName, lastName, accountType, emailPrefix) => {
  const email = `${emailPrefix}@skillora.dev`;
  let user = await User.findOne({ email });
  if (user) return user;
  const profile = await Profile.create({});
  return User.create({
    firstName, lastName, email, accountType,
    password: await bcrypt.hash(PASSWORD, 10),
    additionalDetails: profile._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`,
  });
};

const seedDemo = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  const instructors = [];
  for (const [first, last] of INSTRUCTORS) {
    instructors.push(await upsertUser(first, last, "Instructor", `${first}.${last}`.toLowerCase()));
  }
  const students = [];
  for (const [first, last] of STUDENTS) {
    students.push(await upsertUser(first, last, "Student", `${first}.${last}`.toLowerCase()));
  }

  let created = 0;
  for (const [i, [catName, slug, title, description, price, tags, learn, reqs, sections, instIdx]] of COURSES.entries()) {
    if (await Course.findOne({ courseName: title })) continue;
    const category = await Category.findOneAndUpdate({ name: catName }, { $setOnInsert: { name: catName } }, { upsert: true, new: true });
    const instructor = instructors[instIdx];

    const sectionIds = [];
    let n = 0;
    for (const [sectionName, lectures] of sections) {
      const subIds = [];
      for (const lecture of lectures) {
        const sub = await SubSection.create({
          title: lecture,
          timeDuration: "0:13",
          videoUrl: VIDEOS[n++ % VIDEOS.length],
          description: `In this lesson: ${lecture.toLowerCase()}.`,
        });
        subIds.push(sub._id);
      }
      sectionIds.push((await Section.create({ sectionName, subSection: subIds }))._id);
    }

    const enrolled = students.filter((_, idx) => (idx + i) % 3 !== 0).slice(0, 2 + (i % 4));
    const course = await Course.create({
      courseName: title, courseDescription: description, instructor: instructor._id,
      whatYouWillLearn: learn, courseContent: sectionIds, price, thumbnail: `/demo/${slug}.svg`,
      tags, category: category._id, instructions: reqs, status: "Published",
      studentsEnrolled: enrolled.map((s) => s._id),
      createdAt: new Date(Date.now() - i * 36e5 * 7),
    });
    await User.findByIdAndUpdate(instructor._id, { $push: { courses: course._id } });
    await Category.findByIdAndUpdate(category._id, { $addToSet: { courses: course._id } });

    const reviewIds = [];
    for (const [k, student] of enrolled.entries()) {
      const progress = await CourseProgress.create({ courseId: course._id, userId: student._id, completeVideos: [] });
      await User.findByIdAndUpdate(student._id, { $addToSet: { courses: course._id, courseProgress: progress._id } });
      if (k < REVIEWS.length && (i + k) % 4 !== 3) {
        const [rating, review] = REVIEWS[(i + k) % REVIEWS.length];
        reviewIds.push((await RatingAndReview.create({ user: student._id, course: course._id, rating, review }))._id);
      }
    }
    await Course.findByIdAndUpdate(course._id, { ratingAndReviews: reviewIds });
    created++;
  }

  console.log(`Demo data ready: ${created} new courses (${COURSES.length} total)`);
  console.log(PASSWORD === "Demo1234" ? "  demo logins use the default password Demo1234" : "  demo logins use the password you set in DEMO_PASSWORD");
  console.log(`  instructor: aarav.mehta@skillora.dev   student: ananya.rao@skillora.dev`);
};

module.exports = seedDemo;

if (require.main === module) {
  seedDemo()
    .then(() => mongoose.disconnect())
    .catch((err) => { console.error(err); process.exit(1); });
}
