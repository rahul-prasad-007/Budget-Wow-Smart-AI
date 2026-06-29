import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB, { isDbConnected } from "../../database/connection.js";
import { isGoogleConfigured } from "./config/google.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";
import { handleUploadError } from "./middleware/upload.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  const dbConnected = isDbConnected();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    database: dbConnected ? "connected" : "disconnected",
    message: "BudgetWow Smart AI API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/insights", insightsRoutes);

app.use(handleUploadError);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      if (process.env.NODE_ENV === "production") {
        if (!process.env.CLIENT_URL || process.env.CLIENT_URL.includes("localhost")) {
          console.warn(
            "CLIENT_URL should be your production frontend URL (e.g. https://your-app.netlify.app) for CORS and OAuth redirects."
          );
        }
        if (!process.env.API_URL) {
          console.warn(
            "API_URL should be your Render service URL (e.g. https://budgetwow-api.onrender.com) for Google OAuth callbacks."
          );
        }
        if (!process.env.JWT_SECRET) {
          console.warn("JWT_SECRET is required in production.");
        }
      }
      if (!isGoogleConfigured()) {
        console.warn(
          "Google OAuth is NOT configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env — see GOOGLE_AUTH_SETUP.md"
        );
      } else {
        console.log("Google OAuth is configured");
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
