export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getExpensesByCategory = (expenses) => {
  const categories = {
    food: 0,
    transport: 0,
    entertainment: 0,
    shopping: 0,
    utilities: 0,
    other: 0,
    health: 0,
  };

  expenses.forEach((expense) => {
    categories[expense.category] += expense.amount;
  });

  return categories;
};

export const getChartData = (expenses) => {
  const expensesByCategory = getExpensesByCategory(expenses);
  return Object.entries(expensesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
};

export const getCategoryTextColor = (category) => {
  const colors = {
    food: "text-indigo-500",
    transport: "text-cyan-500",
    entertainment: "text-purple-500",
    utilities: "text-teal-500",
    health: "text-green-500",
    shopping: "text-orange-500",
    other: "text-slate-500",
  };
  return colors[category] || "text-gray-500";
};

export const getMonthName = (date) => {
  return date.toLocaleString("default", { month: "long" });
};

const parseExpenseDate = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return Number.isNaN(d.getTime()) ? null : d;
};

const monthYearSortKey = (monthYear) => {
  const d = new Date(`${monthYear} 1`);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
};

/**
 * Bar chart data: totals per month-year for every expense (not limited to recent months).
 * When history spans many years, groups by year so 2015 / 2024 / 2026 all appear clearly.
 */
export const getExpensesByMonth = (expenses) => {
  const dated = expenses
    .map((expense) => ({ expense, date: parseExpenseDate(expense.date) }))
    .filter((entry) => entry.date);

  if (dated.length === 0) return {};

  const timestamps = dated.map((entry) => entry.date.getTime());
  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));
  const monthSpan =
    (maxDate.getFullYear() - minDate.getFullYear()) * 12 +
    (maxDate.getMonth() - minDate.getMonth());
  const useYearly =
    maxDate.getFullYear() - minDate.getFullYear() >= 2 || monthSpan > 24;

  const totals = {};

  dated.forEach(({ expense, date }) => {
    const key = useYearly
      ? String(date.getFullYear())
      : `${getMonthName(date)} ${date.getFullYear()}`;
    totals[key] = (totals[key] || 0) + expense.amount;
  });

  const sorted = Object.entries(totals).sort(([a], [b]) => {
    if (useYearly) return Number(a) - Number(b);
    return monthYearSortKey(a) - monthYearSortKey(b);
  });

  return Object.fromEntries(sorted);
};
