import express from "express";
import UserSettings from "../../../database/models/UserSettings.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const settings = await UserSettings.findOne({ userId: req.user._id }).lean();

    res.json({
      daily: settings?.dailyLimit ?? null,
      monthly: settings?.monthlyLimit ?? null,
      yearly: settings?.yearlyLimit ?? null,
    });
  } catch (error) {
    console.error("Fetch settings error:", error);
    res.status(500).json({ message: "Failed to fetch budget limits." });
  }
});

router.put("/", async (req, res) => {
  try {
    const { dailyLimit, monthlyLimit, yearlyLimit } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        dailyLimit: dailyLimit != null && dailyLimit !== "" ? Number(dailyLimit) : null,
        monthlyLimit: monthlyLimit != null && monthlyLimit !== "" ? Number(monthlyLimit) : null,
        yearlyLimit: yearlyLimit != null && yearlyLimit !== "" ? Number(yearlyLimit) : null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      daily: settings.dailyLimit,
      monthly: settings.monthlyLimit,
      yearly: settings.yearlyLimit,
    });
  } catch (error) {
    console.error("Save settings error:", error);
    res.status(500).json({ message: "Failed to save budget limits." });
  }
});

export default router;
