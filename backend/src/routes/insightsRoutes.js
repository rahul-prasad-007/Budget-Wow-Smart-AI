import express from "express";
import Expense from "../../../database/models/Expense.js";
import UserSettings from "../../../database/models/UserSettings.js";
import { protect } from "../middleware/auth.js";
import { generateFinancialInsights, isGroqConfigured } from "../services/groqService.js";

const router = express.Router();

router.use(protect);

router.get("/status", (_req, res) => {
  res.json({ configured: isGroqConfigured() });
});

router.get("/", async (req, res) => {
  try {
    const [expenses, settings] = await Promise.all([
      Expense.find({ userId: req.user._id }).lean(),
      UserSettings.findOne({ userId: req.user._id }).lean(),
    ]);

    const budgetLimits = {
      daily: settings?.dailyLimit ?? null,
      monthly: settings?.monthlyLimit ?? null,
      yearly: settings?.yearlyLimit ?? null,
    };

    const insights = await generateFinancialInsights(expenses, budgetLimits);
    res.json(insights);
  } catch (error) {
    console.error("Insights error:", error);
    res.status(500).json({ message: "Failed to generate insights." });
  }
});

export default router;
