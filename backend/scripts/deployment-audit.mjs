/**
 * Deployment audit: env loading, MongoDB connection, model CRUD smoke test.
 * Run: node scripts/deployment-audit.mjs
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "../../database/connection.js";
import User from "../../database/models/User.js";
import Expense from "../../database/models/Expense.js";
import UserSettings from "../../database/models/UserSettings.js";
import Feedback from "../../database/models/Feedback.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SENSITIVE_KEYS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GOOGLE_CLIENT_SECRET",
  "GEMINI_API_KEY",
  "GROQ_API_KEY",
];

const mask = (key, value) => {
  if (!value) return "(not set)";
  if (!SENSITIVE_KEYS.includes(key)) return value;
  if (key === "MONGODB_URI") {
    return value.replace(/:([^@/]+)@/, ":****@");
  }
  if (value.length <= 8) return "****";
  return `${value.slice(0, 4)}****${value.slice(-4)}`;
};

const ENV_KEYS = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "API_URL",
  "CLIENT_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GEMINI_API_KEY",
  "GEMINI_MODEL",
  "GROQ_API_KEY",
  "GROQ_MODEL",
  "NODE_ENV",
];

console.log("\n=== Environment variables (sensitive values masked) ===\n");
for (const key of ENV_KEYS) {
  console.log(`${key}=${mask(key, process.env[key])}`);
}

console.log("\n=== MONGODB_URI check ===\n");
if (!process.env.MONGODB_URI) {
  console.error("✗ MONGODB_URI is NOT defined");
  process.exit(1);
}
console.log("✓ MONGODB_URI is defined");

const uri = process.env.MONGODB_URI;
if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
  console.error("✗ Invalid MONGODB_URI scheme");
  process.exit(1);
}
console.log("✓ MONGODB_URI format looks valid");

console.log("\n=== MongoDB connection ===\n");
try {
  await connectDB();
} catch (error) {
  console.error("✗ Connection failed:", error.message);
  process.exit(1);
}

console.log("\n=== Registered models ===\n");
const modelNames = Object.keys(mongoose.models);
console.log(`Models: ${modelNames.join(", ") || "(none)"}`);
const expected = ["User", "Expense", "UserSettings", "Feedback"];
for (const name of expected) {
  console.log(mongoose.models[name] ? `✓ ${name}` : `✗ ${name} missing`);
}

console.log("\n=== CRUD smoke test ===\n");
const testEmail = `deploy-audit-${Date.now()}@test.local`;
let testUser;
let testExpense;
let testSettings;
let testFeedback;

try {
  testUser = await User.create({
    name: "Deploy Audit",
    email: testEmail,
    password: "audit123456",
    provider: "local",
  });
  console.log("✓ CREATE User");

  const foundUser = await User.findById(testUser._id);
  console.log(foundUser ? "✓ READ User" : "✗ READ User failed");

  testExpense = await Expense.create({
    userId: testUser._id,
    description: "Audit expense",
    amount: 9.99,
    category: "food",
    date: new Date().toISOString().split("T")[0],
  });
  console.log("✓ CREATE Expense");

  testExpense.description = "Audit expense updated";
  await testExpense.save();
  console.log("✓ UPDATE Expense");

  testSettings = await UserSettings.create({
    userId: testUser._id,
    dailyLimit: 100,
    monthlyLimit: 1000,
    yearlyLimit: 12000,
  });
  console.log("✓ CREATE UserSettings");

  testFeedback = await Feedback.create({
    name: "Audit",
    email: testEmail,
    rating: 5,
    feedback: "Deployment audit test",
  });
  console.log("✓ CREATE Feedback");

  await Expense.findByIdAndDelete(testExpense._id);
  console.log("✓ DELETE Expense");

  await UserSettings.findByIdAndDelete(testSettings._id);
  await Feedback.findByIdAndDelete(testFeedback._id);
  await User.findByIdAndDelete(testUser._id);
  console.log("✓ Cleanup complete");
} catch (error) {
  console.error("✗ CRUD test failed:", error.message);
  if (testExpense?._id) await Expense.findByIdAndDelete(testExpense._id).catch(() => {});
  if (testSettings?._id) await UserSettings.findByIdAndDelete(testSettings._id).catch(() => {});
  if (testFeedback?._id) await Feedback.findByIdAndDelete(testFeedback._id).catch(() => {});
  if (testUser?._id) await User.findByIdAndDelete(testUser._id).catch(() => {});
  await mongoose.disconnect();
  process.exit(1);
}

await mongoose.disconnect();
console.log("\n=== All deployment checks passed ===\n");
