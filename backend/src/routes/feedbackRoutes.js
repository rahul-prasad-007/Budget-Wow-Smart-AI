import express from "express";
import Feedback from "../../../database/models/Feedback.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .select("name rating feedback timestamp createdAt")
      .sort({ timestamp: -1 })
      .lean();

    res.json({ feedbacks });
  } catch (error) {
    console.error("Fetch feedback error:", error);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;

    if (!name?.trim() || !email?.trim() || !feedback?.trim() || !rating) {
      return res.status(400).json({ message: "All feedback fields are required." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    await Feedback.create({
      name: name.trim(),
      email: email.trim(),
      rating: Number(rating),
      feedback: feedback.trim(),
      timestamp: Date.now(),
    });

    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: "Failed to submit feedback." });
  }
});

export default router;
