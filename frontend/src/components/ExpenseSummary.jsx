import React, { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import {
  formatCurrency,
  getExpensesByCategory,
  getTotalExpenses,
} from "../utils/expenses";
import {
  getCategoryIcon,
  getCategoryLabel,
  getCategoryTextColor,
} from "../utils/categories";
import {
  getDailyExpenses,
  getMonthlyExpenses,
  getYearlyExpenses,
  getUserLimits,
  checkLimitExceeded,
} from "../utils/budgetLimits";
import { TrendingDown, TrendingUp, Wallet, AlertTriangle } from "lucide-react";

const ExpenseSummary = () => {
  const { expenses } = useExpenses();
  const { currentUser } = useAuth();
  const [limits, setLimits] = useState({ daily: null, monthly: null, yearly: null });
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadLimits();
    }
    
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

  useEffect(() => {
    if (currentUser && expenses.length >= 0) {
      checkWarnings();
    }
  }, [limits, expenses, currentUser]);

  const loadLimits = async () => {
    if (currentUser) {
      const userLimits = await getUserLimits();
      setLimits(userLimits);
    }
  };

  const checkWarnings = () => {
    const newWarnings = [];
    const today = new Date();

    if (limits.daily !== null && limits.daily !== undefined && limits.daily > 0) {
      const dailyExpenses = getDailyExpenses(expenses, today);
      const dailyCheck = checkLimitExceeded(dailyExpenses, limits.daily);
      if (dailyCheck.exceeded) {
        newWarnings.push({
          type: "daily",
          current: dailyExpenses,
          limit: limits.daily,
          percentage: dailyCheck.percentage,
        });
      }
    }

    if (limits.monthly !== null && limits.monthly !== undefined && limits.monthly > 0) {
      const monthlyExpenses = getMonthlyExpenses(expenses, today);
      const monthlyCheck = checkLimitExceeded(monthlyExpenses, limits.monthly);
      if (monthlyCheck.exceeded) {
        newWarnings.push({
          type: "monthly",
          current: monthlyExpenses,
          limit: limits.monthly,
          percentage: monthlyCheck.percentage,
        });
      }
    }

    if (limits.yearly !== null && limits.yearly !== undefined && limits.yearly > 0) {
      const yearlyExpenses = getYearlyExpenses(expenses, today);
      const yearlyCheck = checkLimitExceeded(yearlyExpenses, limits.yearly);
      if (yearlyCheck.exceeded) {
        newWarnings.push({
          type: "yearly",
          current: yearlyExpenses,
          limit: limits.yearly,
          percentage: yearlyCheck.percentage,
        });
      }
    }

    setWarnings(newWarnings);
  };

  const totalExpenses = getTotalExpenses(expenses);
  const categoriesData = getExpensesByCategory(expenses);

  let highestCategory = {
    name: "none",
    amount: 0,
  };

  Object.entries(categoriesData).forEach(([category, amount]) => {
    if (amount > highestCategory.amount) {
      highestCategory = { name: category, amount: amount };
    }
  });

  const today = new Date();
  const dailyExpenses = limits.daily ? getDailyExpenses(expenses, today) : 0;
  const monthlyExpenses = limits.monthly ? getMonthlyExpenses(expenses, today) : 0;
  const yearlyExpenses = limits.yearly ? getYearlyExpenses(expenses, today) : 0;

  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="dash-warning-banner">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" size={18} />
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">Budget Limit Exceeded!</h3>
              {warnings.map((warning, index) => (
                <p key={index} className="text-red-700 text-xs sm:text-sm mb-1">
                  <strong>{warning.type.charAt(0).toUpperCase() + warning.type.slice(1)}</strong> limit exceeded: 
                  You've spent {formatCurrency(warning.current)} out of {formatCurrency(warning.limit)} 
                  ({Math.round(warning.percentage)}%)
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Status Cards - Show even when not exceeded */}
      {(limits.daily || limits.monthly || limits.yearly) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {limits.daily && (
            <div className="dash-budget-card dash-budget-card--blue">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-blue-700">Daily Budget</span>
                <span className={`text-xs sm:text-sm font-bold ${dailyExpenses > limits.daily ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.round((dailyExpenses / limits.daily) * 100)}%
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {formatCurrency(dailyExpenses)} / {formatCurrency(limits.daily)}
              </div>
              <div className="mt-2 w-full dash-progress-track dash-progress-track--blue">
                <div
                  className={`dash-progress-fill dash-progress-fill--blue ${dailyExpenses > limits.daily ? "dash-progress-fill--danger" : ""}`}
                  style={{ width: `${Math.min((dailyExpenses / limits.daily) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          {limits.monthly && (
            <div className="dash-budget-card dash-budget-card--purple">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-purple-700">Monthly Budget</span>
                <span className={`text-xs sm:text-sm font-bold ${monthlyExpenses > limits.monthly ? 'text-red-600' : 'text-purple-600'}`}>
                  {Math.round((monthlyExpenses / limits.monthly) * 100)}%
                </span>
              </div>
              <div className="text-xs text-purple-600">
                {formatCurrency(monthlyExpenses)} / {formatCurrency(limits.monthly)}
              </div>
              <div className="mt-2 w-full dash-progress-track dash-progress-track--purple">
                <div
                  className={`dash-progress-fill dash-progress-fill--purple ${monthlyExpenses > limits.monthly ? "dash-progress-fill--danger" : ""}`}
                  style={{ width: `${Math.min((monthlyExpenses / limits.monthly) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          {limits.yearly && (
            <div className="dash-budget-card dash-budget-card--green">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-green-700">Yearly Budget</span>
                <span className={`text-xs sm:text-sm font-bold ${yearlyExpenses > limits.yearly ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.round((yearlyExpenses / limits.yearly) * 100)}%
                </span>
              </div>
              <div className="text-xs text-green-600">
                {formatCurrency(yearlyExpenses)} / {formatCurrency(limits.yearly)}
              </div>
              <div className="mt-2 w-full dash-progress-track dash-progress-track--green">
                <div
                  className={`dash-progress-fill dash-progress-fill--green ${yearlyExpenses > limits.yearly ? "dash-progress-fill--danger" : ""}`}
                  style={{ width: `${Math.min((yearlyExpenses / limits.yearly) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="dash-stat-grid">
        <article
          className="accent-card accent-card--stat"
          style={{ "--accent-color": "#6366f1", animationDelay: "0s" }}
        >
          <div className="dash-stat-icon-wrap">
            <Wallet size={26} strokeWidth={2.25} />
          </div>
          <div className="dash-stat-content min-w-0">
            <p className="dash-stat-label">Total Expenses</p>
            <p className="dash-stat-value">{formatCurrency(totalExpenses)}</p>
          </div>
        </article>

        <article
          className="accent-card accent-card--stat"
          style={{ "--accent-color": "#ec4899", animationDelay: "0.1s" }}
        >
          <div className="dash-stat-icon-wrap">
            <TrendingUp size={26} strokeWidth={2.25} />
          </div>
          <div className="dash-stat-content min-w-0">
            <p className="dash-stat-label">Highest Category</p>
            {highestCategory.name !== "none" ? (
              <>
                <p className="dash-stat-value dash-stat-value--category">
                  <span className="dash-stat-emoji">{getCategoryIcon(highestCategory.name)}</span>
                  <span className="capitalize truncate">{getCategoryLabel(highestCategory.name)}</span>
                </p>
                <p className="dash-stat-subvalue">{formatCurrency(highestCategory.amount)}</p>
              </>
            ) : (
              <p className="dash-stat-value">None</p>
            )}
          </div>
        </article>

        <article
          className="accent-card accent-card--stat"
          style={{ "--accent-color": "#10b981", animationDelay: "0.2s" }}
        >
          <div className="dash-stat-icon-wrap">
            <TrendingDown size={26} strokeWidth={2.25} />
          </div>
          <div className="dash-stat-content min-w-0">
            <p className="dash-stat-label">Total Entries</p>
            <p className="dash-stat-value">{expenses.length}</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ExpenseSummary;
