import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { settingsApi } from "../api/client";
import toast from "react-hot-toast";
import { Settings, Save, Wallet, Calendar, CalendarDays, CalendarRange, Trash2 } from "lucide-react";
import Modal from "./ui/Modal";

const LIMIT_FIELDS = [
  {
    key: "daily",
    label: "Daily",
    placeholder: "Daily limit",
    accent: "#3b82f6",
    Icon: Calendar,
  },
  {
    key: "monthly",
    label: "Monthly",
    placeholder: "Monthly limit",
    accent: "#a855f7",
    Icon: CalendarDays,
  },
  {
    key: "yearly",
    label: "Yearly",
    placeholder: "Yearly limit",
    accent: "#10b981",
    Icon: CalendarRange,
  },
];

const BudgetLimitSettings = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limits, setLimits] = useState({
    daily: "",
    monthly: "",
    yearly: "",
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      loadLimits();
    }
  }, [currentUser, isOpen]);

  const loadLimits = async () => {
    if (!currentUser) return;

    try {
      const data = await settingsApi.get();
      setLimits({
        daily: data.daily ?? "",
        monthly: data.monthly ?? "",
        yearly: data.yearly ?? "",
      });
    } catch {
      toast.error("Failed to load budget limits");
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error("Please log in to set limits");
      return;
    }

    setLoading(true);
    try {
      await settingsApi.update({
        daily: limits.daily ? Number(limits.daily) : null,
        monthly: limits.monthly ? Number(limits.monthly) : null,
        yearly: limits.yearly ? Number(limits.yearly) : null,
      });
      toast.success("Budget limits saved successfully");
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent("budgetLimitsUpdated"));
    } catch {
      toast.error("Failed to save budget limits");
    } finally {
      setLoading(false);
    }
  };

  const hasActiveLimits = Boolean(limits.daily || limits.monthly || limits.yearly);

  const handleRemove = async () => {
    if (!currentUser) {
      toast.error("Please log in to remove limits");
      return;
    }

    if (!hasActiveLimits) return;

    setLoading(true);
    try {
      await settingsApi.update({
        daily: null,
        monthly: null,
        yearly: null,
      });
      setLimits({ daily: "", monthly: "", yearly: "" });
      toast.success("Budget limits removed");
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent("budgetLimitsUpdated"));
    } catch {
      toast.error("Failed to remove budget limits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="budget-limits-trigger accent-card accent-card--budget-trigger"
        style={{ "--accent-color": "#6366f1" }}
      >
        <Settings size={16} />
        Budget Limits
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Set Budget Limits"
        subtitle="Daily, monthly & yearly spending caps"
        icon={Wallet}
        ariaLabelledBy="budget-limits-title"
        maxWidth="max-w-md"
        panelClassName="accent-card accent-card--budget-modal"
        accentColor="#6366f1"
        bodyClassName="p-4 sm:p-5"
      >
        <div className="budget-limits-form">
          <div className="budget-limits-fields">
            {LIMIT_FIELDS.map(({ key, label, placeholder, accent, Icon }) => (
              <div
                key={key}
                className="budget-limit-row"
                style={{ "--accent-color": accent }}
              >
                <div className="budget-limit-row__icon" aria-hidden="true">
                  <Icon size={15} strokeWidth={2.25} />
                </div>
                <label htmlFor={`budget-${key}`} className="budget-limit-row__label">
                  {label}
                </label>
                <div className="budget-limit-row__input-wrap">
                  <span className="budget-limit-row__currency" aria-hidden="true">₹</span>
                  <input
                    id={`budget-${key}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={limits[key]}
                    onChange={(e) => setLimits({ ...limits, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="budget-limit-row__input"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="budget-limits-footer">
            {hasActiveLimits && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
                className="budget-limits-btn budget-limits-btn--remove budget-limits-btn--compact"
              >
                <Trash2 size={14} />
                {loading ? "Removing..." : "Remove All Limits"}
              </button>
            )}

            <div className="budget-limits-actions">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="budget-limits-btn budget-limits-btn--cancel budget-limits-btn--compact"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="budget-limits-btn budget-limits-btn--save budget-limits-btn--compact"
              >
                <Save size={15} />
                {loading ? "Saving..." : "Save Limits"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BudgetLimitSettings;
