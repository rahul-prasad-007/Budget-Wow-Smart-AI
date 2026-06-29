import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { X, ScanLine, Sparkles, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useExpenses } from "../../context/ExpenseContext";
import { useReceiptScan, useReceiptStatus } from "../../hooks/useAI";
import ReceiptUploadZone from "./ReceiptUploadZone";
import ReceiptConfirmForm from "./ReceiptConfirmForm";
import { ReceiptScanSkeleton } from "./AISkeleton";
import { formatCurrency } from "../../utils/expenses";

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "scanning", label: "Scan" },
  { id: "confirm", label: "Confirm" },
];

const ReceiptScannerModal = ({ isOpen, onClose }) => {
  const { addExpense } = useExpenses();
  const queryClient = useQueryClient();
  const scanMutation = useReceiptScan();
  const { data: status } = useReceiptStatus();

  const [step, setStep] = useState("upload");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep("upload");
      setPreview(null);
      setFile(null);
      setExtracted(null);
      scanMutation.reset();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setStep("scanning");

    try {
      const result = await scanMutation.mutateAsync(selectedFile);
      setExtracted(result);
      setStep("confirm");
      toast.success("Receipt scanned successfully!");
    } catch (error) {
      setStep("upload");
      toast.error(error.message || "Failed to scan receipt.");
    }
  };

  const handleConfirm = async () => {
    if (!extracted) return;

    if (!extracted.description?.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!extracted.amount || Number(extracted.amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsSaving(true);
    try {
      await addExpense({
        description: extracted.description.trim(),
        amount: Number(extracted.amount),
        category: extracted.suggestedCategory,
        date: extracted.date,
        merchantName: extracted.merchantName,
        paymentMethod: extracted.paymentMethod,
        source: "receipt_scan",
        confidenceScore: extracted.confidenceScore,
      });
      toast.success("Expense added from receipt!");
      queryClient.invalidateQueries({ queryKey: ["ai-insights"] });
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save expense.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanAgain = () => {
    setStep("upload");
    setExtracted(null);
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    scanMutation.reset();
  };

  const geminiReady = status?.configured !== false;
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return createPortal(
    <div
      className="app-modal-backdrop app-modal-backdrop--enter fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="receipt-scanner-modal app-modal-panel app-modal-panel--enter w-full max-w-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-scanner-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-scanner-modal__header">
          <div className="flex items-center gap-3 min-w-0">
            <div className="receipt-scanner-modal__icon-wrap" aria-hidden="true">
              <ScanLine className="w-5 h-5" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <h2 id="receipt-scanner-title" className="receipt-scanner-modal__title">
                Scan Receipt
                <span className="receipt-scanner-modal__ai-tag">
                  <Sparkles size={10} />
                  AI
                </span>
              </h2>
              <p className="receipt-scanner-modal__subtitle">Powered by Gemini Vision</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="receipt-scanner-modal__close app-modal-close"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="receipt-scanner-modal__steps" aria-label="Scan progress">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`receipt-scanner-modal__step ${
                i < stepIndex
                  ? "receipt-scanner-modal__step--done"
                  : i === stepIndex
                    ? "receipt-scanner-modal__step--active"
                    : ""
              }`}
            >
              <span className="receipt-scanner-modal__step-dot">{i + 1}</span>
              <span className="receipt-scanner-modal__step-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="receipt-scanner-modal__body">
          {!geminiReady && (
            <div className="receipt-scanner-modal__alert">
              Receipt scanning requires{" "}
              <code className="font-mono text-xs">GEMINI_API_KEY</code> in backend/.env
            </div>
          )}

          {step === "upload" && (
            <ReceiptUploadZone
              preview={preview}
              onFileSelect={handleFileSelect}
              disabled={!geminiReady || scanMutation.isPending}
            />
          )}

          {step === "scanning" && (
            <div className="receipt-scanner-modal__scanning">
              <div className="receipt-scanner-modal__scanning-head">
                <Loader2 className="receipt-scanner-modal__spinner animate-spin" size={22} />
                <div>
                  <p className="receipt-scanner-modal__scanning-title">Analyzing receipt with AI</p>
                  <p className="receipt-scanner-modal__scanning-sub">
                    Extracting merchant, amount, date & category…
                  </p>
                </div>
              </div>
              <ReceiptScanSkeleton />
            </div>
          )}

          {step === "confirm" && extracted && (
            <ReceiptConfirmForm
              data={extracted}
              onChange={setExtracted}
            />
          )}
        </div>

        {step === "confirm" && extracted && (
          <div className="receipt-scanner-modal__footer">
            {extracted.amount > 0 && (
              <p className="receipt-scanner-modal__footer-total">
                Total:{" "}
                <span>{formatCurrency(Number(extracted.amount))}</span>
              </p>
            )}
            <div className="receipt-scanner-modal__footer-actions">
              <button
                type="button"
                onClick={handleScanAgain}
                disabled={isSaving}
                className="receipt-scanner-modal__btn receipt-scanner-modal__btn--secondary"
              >
                Scan Again
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSaving}
                className="receipt-scanner-modal__btn receipt-scanner-modal__btn--primary"
              >
                {isSaving ? "Saving..." : "Confirm & Add Expense"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ReceiptScannerModal;
