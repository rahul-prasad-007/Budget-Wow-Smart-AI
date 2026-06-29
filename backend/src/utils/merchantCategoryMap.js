const MERCHANT_RULES = [
  { keywords: ["uber", "ola", "lyft", "grab", "rapido", "metro", "irctc", "petrol", "fuel", "shell", "bp "], category: "transport" },
  { keywords: ["starbucks", "mcdonald", "kfc", "domino", "pizza", "swiggy", "zomato", "cafe", "restaurant", "food", "dunkin", "subway", "barista"], category: "food" },
  { keywords: ["amazon", "flipkart", "myntra", "walmart", "target", "ebay", "shopify", "mall", "store"], category: "shopping" },
  { keywords: ["netflix", "spotify", "prime video", "hotstar", "cinema", "pvr", "inox", "game"], category: "entertainment" },
  { keywords: ["electric", "water", "gas bill", "internet", "jio", "airtel", "vi ", "broadband", "utility"], category: "utilities" },
  { keywords: ["hospital", "pharmacy", "medical", "clinic", "apollo", "medicine", "health"], category: "health" },
  { keywords: ["udemy", "coursera", "university", "school", "college", "education", "books"], category: "education" },
  { keywords: ["airline", "flight", "hotel", "booking.com", "makemytrip", "goibibo", "airbnb", "travel"], category: "travel" },
  { keywords: ["subscription", "insurance", "rent", "emi", "loan", "bill pay"], category: "bills" },
];

const VALID_CATEGORIES = new Set([
  "food", "transport", "entertainment", "shopping", "utilities",
  "health", "education", "travel", "bills", "other",
]);

export const mapMerchantToCategory = (merchantName, suggestedCategory) => {
  const normalized = (merchantName || "").toLowerCase();

  for (const rule of MERCHANT_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.category;
    }
  }

  const normalizedCategory = (suggestedCategory || "").toLowerCase().replace(/\s+/g, "");
  const categoryAliases = {
    fooddining: "food",
    food: "food",
    transportation: "transport",
    transport: "transport",
    entertainment: "entertainment",
    shopping: "shopping",
    utilities: "utilities",
    healthmedical: "health",
    health: "health",
    education: "education",
    travel: "travel",
    billssubscriptions: "bills",
    bills: "bills",
    other: "other",
  };

  const mapped = categoryAliases[normalizedCategory];
  if (mapped && VALID_CATEGORIES.has(mapped)) return mapped;

  return VALID_CATEGORIES.has(suggestedCategory) ? suggestedCategory : "other";
};

export const VALID_CATEGORY_IDS = [...VALID_CATEGORIES];
