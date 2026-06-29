import React, { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  getDailyExpenses,
  getMonthlyExpenses,
  getYearlyExpenses,
  getUserLimits,
  checkLimitExceeded,
} from "../utils/budgetLimits";
import { formatCurrency } from "../utils/expenses";
import {
  getAllCategories,
  getCategoryIcon,
} from "../utils/categories";
import { X, Plus, ScanLine, Sparkles, Tag, PenLine, IndianRupee, Calendar } from "lucide-react";
import ReceiptScannerModal from "./ai/ReceiptScannerModal";
import Modal from "./ui/Modal";

/**
 * ExpenseForm Component
 *
 * Form for adding new expenses with description, amount, category, and date.
 * Checks budget limits before submission and resets on success.
 */
const ExpenseForm = () => {
  const { addExpense, expenses } = useExpenses();
  const { currentUser } = useAuth();
  
  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevents double submission
  const [limits, setLimits] = useState({ daily: null, monthly: null, yearly: null }); // Budget limits
  const [showCustomCategoryModal, setShowCustomCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customCategoryIcon, setCustomCategoryIcon] = useState("📦");
  const [customCategories, setCustomCategories] = useState([]);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);

  // Load budget limits when user changes and listen for updates
  useEffect(() => {
    if (currentUser) {
      loadLimits();
    }
    
    // Listen for budget limit updates from BudgetLimitSettings component
    const handleLimitsUpdate = () => {
      if (currentUser) {
        loadLimits();
      }
    };
    
    window.addEventListener('budgetLimitsUpdated', handleLimitsUpdate);
    
    return () => {
      window.removeEventListener('budgetLimitsUpdated', handleLimitsUpdate);
    };
  }, [currentUser]);

  const loadLimits = async () => {
    if (currentUser) {
      const userLimits = await getUserLimits();
      setLimits(userLimits);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    // Validation
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const expenseAmount = Number(amount);
    const expenseDate = new Date(date);
    const warnings = [];
    
    if (limits.daily) {
      const dailyExpenses = getDailyExpenses(expenses, expenseDate);
      const newDailyTotal = dailyExpenses + expenseAmount;
      if (newDailyTotal > limits.daily) {
        warnings.push(`Daily limit will be exceeded! Current: ${formatCurrency(dailyExpenses)}, After adding: ${formatCurrency(newDailyTotal)}, Limit: ${formatCurrency(limits.daily)}`);
      }
    }
    
    if (limits.monthly) {
      const monthlyExpenses = getMonthlyExpenses(expenses, expenseDate);
      const newMonthlyTotal = monthlyExpenses + expenseAmount;
      if (newMonthlyTotal > limits.monthly) {
        warnings.push(`Monthly limit will be exceeded! Current: ${formatCurrency(monthlyExpenses)}, After adding: ${formatCurrency(newMonthlyTotal)}, Limit: ${formatCurrency(limits.monthly)}`);
      }
    }
    
    if (limits.yearly) {
      const yearlyExpenses = getYearlyExpenses(expenses, expenseDate);
      const newYearlyTotal = yearlyExpenses + expenseAmount;
      if (newYearlyTotal > limits.yearly) {
        warnings.push(`Yearly limit will be exceeded! Current: ${formatCurrency(yearlyExpenses)}, After adding: ${formatCurrency(newYearlyTotal)}, Limit: ${formatCurrency(limits.yearly)}`);
      }
    }

    if (warnings.length > 0) {
      warnings.forEach(warning => {
        toast.error(warning, { duration: 5000 });
      });
    }
    
    setIsSubmitting(true);
    
    try {
      await addExpense({
        description: description.trim(),
        amount: expenseAmount,
        category,
        date,
      });

      toast.success("Expense added successfully");
      setDescription("");
      setAmount("");
      setCategory("food");
      setDate(new Date().toISOString().split("T")[0]);
      
    } catch (error) {
      let errorMessage = "Failed to add expense. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allCategories = [...getAllCategories(), ...customCategories];
  const popularCategories = allCategories.slice(0, 6);

  const commonIcons = ["🍔", "🚗", "🎬", "🛍️", "💡", "🏥", "📚", "✈️", "📄", "📦", "🏠", "🎮", "💻", "☕", "🍕", "🎵", "🎨", "⚽", "🎯", "💎"];

  const handleCreateCustomCategory = () => {
    if (!customCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const newCategory = {
      id: customCategoryName.toLowerCase().replace(/\s+/g, "-"),
      label: customCategoryName.trim(),
      icon: customCategoryIcon,
      color: "#64748b",
      bgColor: "#f8fafc",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
      isCustom: true,
    };

    setCustomCategories([...customCategories, newCategory]);
    setCategory(newCategory.id);
    setShowCustomCategoryModal(false);
    setCustomCategoryName("");
    setCustomCategoryIcon("📦");
    toast.success("Custom category created!");
  };

  return (
    <div className="dash-form-card accent-card accent-card--expense-form w-full max-w-md mx-auto">
      <div className="dash-form-header">
        <div className="dash-form-heading">
          <div className="dash-form-heading__icon" aria-hidden="true">
            <PenLine size={18} strokeWidth={2.25} />
          </div>
          <div>
            <h2 className="dash-form-title">
              <span className="dash-form-title__main">Add New</span>{" "}
              <span className="dash-form-title__accent">Expense</span>
            </h2>
            <p className="dash-form-subtitle">Manual entry or AI receipt scan</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowReceiptScanner(true)}
          className="dash-scan-receipt-btn shrink-0 w-full sm:w-auto"
        >
          <span className="dash-scan-receipt-btn__icon" aria-hidden="true">
            <ScanLine size={17} strokeWidth={2.25} />
          </span>
          <span className="dash-scan-receipt-btn__text">
            Scan Receipt
            <span className="dash-scan-receipt-btn__ai">
              <Sparkles size={10} />
              AI
            </span>
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="dash-form-body">
        <div className="dash-form-field">
          <label htmlFor="description" className="dash-form-label">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
            className="dash-form-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="dash-form-field">
          <label htmlFor="amount" className="dash-form-label">
            Amount
          </label>
          <div className="dash-form-amount-wrap">
            <span className="dash-form-amount-prefix" aria-hidden="true">
              <IndianRupee size={14} strokeWidth={2.5} />
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoComplete="off"
              className="dash-form-input dash-form-input--amount"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="dash-form-field">
          <label htmlFor="category" className="dash-form-label">
            Category
          </label>

          <div className="expense-form-categories">
            <div className="expense-form-category-grid">
              {popularCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    disabled={isSubmitting}
                    className={`expense-form-category-chip expense-form-category-btn ${
                      isSelected ? "expense-form-category-chip--selected" : ""
                    }`}
                    style={isSelected ? { "--cat-accent": cat.color } : undefined}
                  >
                    <span className="expense-form-category-chip__icon">{getCategoryIcon(cat.id)}</span>
                    <span className="expense-form-category-chip__label">{cat.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowCustomCategoryModal(true)}
              disabled={isSubmitting}
              className="expense-form-custom-cat-btn"
            >
              <Plus size={14} strokeWidth={2.5} />
              Create Custom Category
            </button>
          </div>

          <div className="dash-form-divider">
            <span>Or pick from list</span>
          </div>

          <div className="dash-select-field dash-select-field--block">
            <select
              id="category-select"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              autoComplete="off"
              className="dash-select dash-select--toolbar dash-select--amber"
              disabled={isSubmitting}
              aria-label="Pick category from list"
            >
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getCategoryIcon(cat.id)} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Modal
          isOpen={showCustomCategoryModal}
          onClose={() => {
            setShowCustomCategoryModal(false);
            setCustomCategoryName("");
            setCustomCategoryIcon("📦");
          }}
          title="Create Custom Category"
          subtitle="Pick a name and icon for your category"
          icon={Tag}
        >
          <div className="space-y-4">
            <div className="app-modal-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                placeholder="e.g., Gym, Pet Care, Hobbies"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-100 focus:outline-none focus:border-expense focus:ring-4 focus:ring-expense/15 transition-all hover:border-indigo-300"
                autoFocus
              />
            </div>

            <div className="app-modal-field">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose Icon
              </label>
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 max-h-32 overflow-y-auto p-2 border-2 border-indigo-100 rounded-xl">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setCustomCategoryIcon(icon)}
                    className={`text-2xl p-2 rounded-lg transition-all hover:bg-indigo-50 hover:scale-110 ${
                      customCategoryIcon === icon
                        ? "bg-indigo-100 ring-2 ring-expense"
                        : ""
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCustomCategoryModal(false);
                  setCustomCategoryName("");
                  setCustomCategoryIcon("📦");
                }}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-indigo-50 hover:border-indigo-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCustomCategory}
                className="flex-1 bg-expense text-white py-2.5 rounded-xl font-semibold hover:bg-expense-dark transition-all hover:-translate-y-0.5"
              >
                Create Category
              </button>
            </div>
          </div>
        </Modal>

        <div className="dash-form-field">
          <label htmlFor="date" className="dash-form-label">
            <Calendar size={12} strokeWidth={2.5} className="dash-form-label__icon" />
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            autoComplete="off"
            className="dash-form-input dash-form-input--date"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          id="submit-expense"
          name="submit-expense"
          className="dash-form-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Expense"}
        </button>
      </form>

      <ReceiptScannerModal
        isOpen={showReceiptScanner}
        onClose={() => setShowReceiptScanner(false)}
      />
    </div>
  );
};

export default ExpenseForm;
