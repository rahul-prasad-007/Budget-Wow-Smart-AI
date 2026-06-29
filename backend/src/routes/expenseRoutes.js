import express from "express";
import Expense from "../../../database/models/Expense.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .lean();

    const formatted = expenses.map((expense) => ({
      id: expense._id.toString(),
      ...expense,
      uid: req.user._id.toString(),
      createdAt: expense.createdAt?.toISOString?.() || expense.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Fetch expenses error:", error);
    res.status(500).json({ message: "Failed to fetch expenses." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      description,
      amount,
      category,
      date,
      merchantName,
      paymentMethod,
      source,
      confidenceScore,
    } = req.body;

    if (!description?.trim() || amount == null || !category || !date) {
      return res.status(400).json({ message: "Missing required expense fields." });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      description: description.trim(),
      amount: Number(amount),
      category,
      date,
      timestamp: Date.now(),
      merchantName: merchantName?.trim() || null,
      paymentMethod: paymentMethod?.trim() || null,
      source: source === "receipt_scan" ? "receipt_scan" : "manual",
      confidenceScore:
        confidenceScore != null ? Math.min(1, Math.max(0, Number(confidenceScore))) : null,
    });

    res.status(201).json({
      id: expense._id.toString(),
      uid: req.user._id.toString(),
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      timestamp: expense.timestamp,
      merchantName: expense.merchantName,
      paymentMethod: expense.paymentMethod,
      source: expense.source,
      confidenceScore: expense.confidenceScore,
      createdAt: expense.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Failed to add expense." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    const { description, amount, category, date } = req.body;
    if (description !== undefined) expense.description = description;
    if (amount !== undefined) expense.amount = Number(amount);
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;

    await expense.save();

    res.json({
      id: expense._id.toString(),
      uid: req.user._id.toString(),
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      timestamp: expense.timestamp,
      createdAt: expense.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Failed to update expense." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.json({ message: "Expense deleted." });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Failed to delete expense." });
  }
});

export default router;
