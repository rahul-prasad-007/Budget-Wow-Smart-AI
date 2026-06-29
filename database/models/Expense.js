import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      default: () => Date.now(),
    },
    merchantName: {
      type: String,
      trim: true,
      default: null,
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: null,
    },
    source: {
      type: String,
      enum: ["manual", "receipt_scan"],
      default: "manual",
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, timestamp: -1 });

const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
