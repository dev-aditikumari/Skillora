// Seeds default categories and (optionally) an admin account.
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='Strong#Pass1' npm run seed
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Category = require("../models/Category");

const CATEGORIES = [
  ["Web Development", "HTML, CSS, JavaScript, React, Node.js and more"],
  ["Data Science", "Python, statistics, machine learning and analytics"],
  ["Mobile Development", "Android, iOS and cross-platform apps"],
  ["Cloud & DevOps", "AWS, Docker, Kubernetes and CI/CD"],
  ["UI/UX Design", "Design systems, prototyping and user research"],
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  for (const [name, description] of CATEGORIES) {
    await Category.updateOne({ name }, { $setOnInsert: { name, description } }, { upsert: true });
  }
  console.log(`Categories ready (${CATEGORIES.length})`);

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const email = ADMIN_EMAIL.trim().toLowerCase();
    if (await User.findOne({ email })) {
      console.log("Admin already exists, skipped");
    } else {
      const profile = await Profile.create({});
      await User.create({
        firstName: "Skillora",
        lastName: "Admin",
        email,
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        accountType: "Admin",
        additionalDetails: profile._id,
        image: "https://api.dicebear.com/5.x/initials/svg?seed=Skillora%20Admin",
      });
      console.log(`Admin created: ${email}`);
    }
  }
};

module.exports = seed;

if (require.main === module) {
  seed()
    .then(() => mongoose.disconnect())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
