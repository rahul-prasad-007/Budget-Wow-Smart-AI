import express from "express";
import { protect } from "../middleware/auth.js";
import { receiptUpload } from "../middleware/upload.js";
import { isGeminiConfigured, scanReceiptImage } from "../services/geminiService.js";

const router = express.Router();

router.use(protect);

router.get("/status", (_req, res) => {
  res.json({ configured: isGeminiConfigured() });
});

router.post("/scan", receiptUpload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a receipt image." });
    }

    if (!isGeminiConfigured()) {
      return res.status(503).json({
        message: "Receipt scanning is not configured. Add GEMINI_API_KEY to backend/.env",
      });
    }

    const extracted = await scanReceiptImage(req.file.buffer, req.file.mimetype);
    res.json(extracted);
  } catch (error) {
    console.error("Receipt scan error:", error);
    res.status(500).json({
      message: error.message || "Failed to scan receipt. Please try again or add manually.",
    });
  }
});

export default router;
