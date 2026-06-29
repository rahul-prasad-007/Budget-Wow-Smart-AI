/**
 * Categories Utility
 * 
 * Manages expense categories with icons, colors, and custom category support.
 */

/**
 * Default categories with icons, colors, and labels
 */
export const defaultCategories = [
  {
    id: "food",
    label: "Food & Dining",
    icon: "🍔",
    color: "#6366f1",
    bgColor: "#eef2ff",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-200",
  },
  {
    id: "transport",
    label: "Transportation",
    icon: "🚗",
    color: "#06b6d4",
    bgColor: "#ecfeff",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-200",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    color: "#a855f7",
    bgColor: "#faf5ff",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: "🛍️",
    color: "#f97316",
    bgColor: "#fff7ed",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: "💡",
    color: "#14b8a6",
    bgColor: "#f0fdfa",
    textColor: "text-teal-600",
    borderColor: "border-teal-200",
  },
  {
    id: "health",
    label: "Health & Medical",
    icon: "🏥",
    color: "#22c55e",
    bgColor: "#f0fdf4",
    textColor: "text-green-600",
    borderColor: "border-green-200",
  },
  {
    id: "education",
    label: "Education",
    icon: "📚",
    color: "#3b82f6",
    bgColor: "#eff6ff",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    id: "travel",
    label: "Travel",
    icon: "✈️",
    color: "#ec4899",
    bgColor: "#fdf2f8",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
  },
  {
    id: "bills",
    label: "Bills & Subscriptions",
    icon: "📄",
    color: "#8b5cf6",
    bgColor: "#faf5ff",
    textColor: "text-violet-600",
    borderColor: "border-violet-200",
  },
  {
    id: "other",
    label: "Other",
    icon: "📦",
    color: "#64748b",
    bgColor: "#f8fafc",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
  },
];

/**
 * Get category by ID
 */
export const getCategoryById = (categoryId) => {
  return defaultCategories.find((cat) => cat.id === categoryId) || defaultCategories.find((cat) => cat.id === "other");
};

/**
 * Get category icon
 */
export const getCategoryIcon = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.icon || "📦";
};

/**
 * Get category color
 */
export const getCategoryColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.color || "#64748b";
};

/**
 * Get category background color class
 */
export const getCategoryBgColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.bgColor || "#f8fafc";
};

/**
 * Get category text color class
 */
export const getCategoryTextColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.textColor || "text-slate-600";
};

/**
 * Get category border color class
 */
export const getCategoryBorderColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.borderColor || "border-slate-200";
};

/**
 * Get category label
 */
export const getCategoryLabel = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category?.label || "Other";
};

/**
 * Get all categories (for dropdowns, etc.)
 */
export const getAllCategories = () => {
  return defaultCategories;
};

/**
 * Get popular categories (most used)
 */
export const getPopularCategories = () => {
  return defaultCategories.slice(0, 6);
};

