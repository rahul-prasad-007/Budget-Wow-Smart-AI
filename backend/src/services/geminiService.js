import { GoogleGenerativeAI } from "@google/generative-ai";
import { mapMerchantToCategory, VALID_CATEGORY_IDS } from "../utils/merchantCategoryMap.js";

const RECEIPT_SCHEMA = {
  merchantName: "string",
  description: "string",
  amount: "number",
  date: "YYYY-MM-DD",
  suggestedCategory: VALID_CATEGORY_IDS.join(" | "),
  paymentMethod: "string or null",
  confidenceScore: "number 0-1",
};

const buildPrompt = () => `You are a receipt OCR and expense extraction assistant.
Analyze the receipt/bill image and return ONLY a valid JSON object (no markdown) with exactly these fields:
${JSON.stringify(RECEIPT_SCHEMA, null, 2)}

Rules:
- amount must be the final total paid (numeric, no currency symbols)
- date must be ISO format YYYY-MM-DD; if unclear use today's date
- suggestedCategory must be one of: ${VALID_CATEGORY_IDS.join(", ")}
- confidenceScore reflects how confident you are in the extraction (0 to 1)
- paymentMethod: UPI, Card, Cash, etc. or null if unknown
- description: brief summary of purchase (max 100 chars)
- merchantName: store/business name`;

export const isGeminiConfigured = () => {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  return key.length > 10 && !key.includes("your_");
};

export const scanReceiptImage = async (buffer, mimeType) => {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini API is not configured. Add GEMINI_API_KEY to backend/.env");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = [
    process.env.GEMINI_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
  ].filter(Boolean);

  const uniqueModels = [...new Set(models)];
  let lastError;

  for (const modelName of uniqueModels) {
    try {
      return await extractWithModel(genAI, modelName, buffer, mimeType);
    } catch (error) {
      lastError = error;
      const msg = error.message || "";
      const retryable = msg.includes("429") || msg.includes("404") || msg.includes("not found");
      if (!retryable) throw error;
      console.warn(`Gemini model ${modelName} failed, trying next...`);
    }
  }

  if (lastError?.message?.includes("429")) {
    throw new Error("Gemini API quota exceeded. Wait a minute and try again, or check billing at https://ai.google.dev");
  }
  throw lastError || new Error("Failed to scan receipt with Gemini.");
};

const extractWithModel = async (genAI, modelName, buffer, mimeType) => {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const result = await model.generateContent([
    buildPrompt(),
    {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType,
      },
    },
  ]);

  const text = result.response.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Failed to parse receipt data from AI response.");
    parsed = JSON.parse(match[0]);
  }

  const merchantName = String(parsed.merchantName || "Unknown Merchant").trim();
  const suggestedCategory = mapMerchantToCategory(
    merchantName,
    parsed.suggestedCategory
  );

  const amount = Number(parsed.amount);
  if (!amount || amount <= 0 || Number.isNaN(amount)) {
    throw new Error("Could not extract a valid amount from the receipt.");
  }

  let date = parsed.date;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    date = new Date().toISOString().split("T")[0];
  }

  const confidenceScore = Math.min(1, Math.max(0, Number(parsed.confidenceScore) || 0.5));

  return {
    merchantName,
    description: String(parsed.description || `Purchase at ${merchantName}`).trim(),
    amount,
    date,
    suggestedCategory,
    paymentMethod: parsed.paymentMethod ? String(parsed.paymentMethod).trim() : null,
    confidenceScore,
  };
};
