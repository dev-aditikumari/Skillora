// Runs the API against a throwaway in-memory MongoDB: `npm run dev:memory`.
// Useful for trying the app without installing MongoDB or touching Atlas.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongod.getUri("skillora");
  process.env.JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret-change-me";
  process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@skillora.dev";
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin1234";
  await require("./seed")();
  console.log(`Dev admin login: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
  await require("../index").start();
  process.on("exit", () => mongod.stop());
})();
