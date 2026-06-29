import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dailyLimit: {
      type: Number,
      default: null,
    },
    monthlyLimit: {
      type: Number,
      default: null,
    },
    yearlyLimit: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const UserSettings =
  mongoose.models.UserSettings || mongoose.model("UserSettings", userSettingsSchema);

export default UserSettings;
