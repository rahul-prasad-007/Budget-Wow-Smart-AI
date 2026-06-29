import { settingsApi } from "../api/client";

export const getDailyExpenses = (expenses, date = new Date()) => {
  const dateStr = date.toISOString().split("T")[0];
  return expenses
    .filter((expense) => expense.date === dateStr)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const getMonthlyExpenses = (expenses, date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  return expenses
    .filter((expense) => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      if (isNaN(expenseDate.getTime())) return false;
      return (
        expenseDate.getFullYear() === year &&
        expenseDate.getMonth() === month
      );
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);
};

export const getYearlyExpenses = (expenses, date = new Date()) => {
  const year = date.getFullYear();

  return expenses
    .filter((expense) => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      if (isNaN(expenseDate.getTime())) return false;
      return expenseDate.getFullYear() === year;
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0);
};

export const getUserLimits = async () => {
  try {
    return await settingsApi.get();
  } catch {
    return { daily: null, monthly: null, yearly: null };
  }
};

export const checkLimitExceeded = (currentAmount, limit) => {
  if (!limit) return { exceeded: false, percentage: 0 };

  const exceeded = currentAmount > limit;
  const percentage = limit > 0 ? (currentAmount / limit) * 100 : 0;

  return { exceeded, percentage };
};
