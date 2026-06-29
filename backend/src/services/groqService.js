const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const isGroqConfigured = () => {
  const key = (process.env.GROQ_API_KEY || "").trim();
  return key.length > 10 && !key.includes("your_");
};

const categoryLabels = {
  food: "Food & Dining",
  transport: "Transportation",
  entertainment: "Entertainment",
  shopping: "Shopping",
  utilities: "Utilities",
  health: "Health & Medical",
  education: "Education",
  travel: "Travel",
  bills: "Bills & Subscriptions",
  other: "Other",
};

export const buildExpenseContext = (expenses, budgetLimits) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear();
  });

  const sum = (list) => list.reduce((s, e) => s + (e.amount || 0), 0);
  const byCategory = (list) =>
    list.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

  const thisMonthTotal = sum(thisMonth);
  const lastMonthTotal = sum(lastMonth);
  const thisMonthByCat = byCategory(thisMonth);

  const highestCat = Object.entries(thisMonthByCat).sort((a, b) => b[1] - a[1])[0];

  return {
    thisMonthTotal,
    lastMonthTotal,
    expenseCount: thisMonth.length,
    highestCategory: highestCat
      ? { id: highestCat[0], label: categoryLabels[highestCat[0]] || highestCat[0], amount: highestCat[1] }
      : null,
    categoryBreakdown: thisMonthByCat,
    budgetLimits,
    percentChange:
      lastMonthTotal > 0
        ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
        : thisMonthTotal > 0
          ? 100
          : 0,
  };
};

export const generateFinancialInsights = async (expenses, budgetLimits) => {
  const context = buildExpenseContext(expenses, budgetLimits);

  if (!isGroqConfigured()) {
    return buildFallbackInsights(context);
  }

  const prompt = `You are BudgetWow Buddy — the user's friendly AI finance coach in BudgetWow Smart AI.

Generate personalized insights from their expense data. Be warm, upbeat, and encouraging — like a supportive friend who loves helping people save money.

TONE & STYLE (apply to EVERY string field):
- Use emojis naturally (2–4 per longer text, 1–2 per short strings). Examples: 💰 📊 ✨ 🎉 💡 🌱 ⚠️ 🛍️ 🍔 🚗 💪 🙌
- Celebrate good habits; be gentle (not harsh) when spending is high
- Keep advice practical and specific to their numbers
- Currency: INR (₹) — use exact amounts from the data
- No markdown, no bullet characters in strings (arrays handle lists)

Return ONLY valid JSON:
{
  "monthlySummary": "2-3 friendly sentences with emojis about this month's spending",
  "highestCategory": { "name": "category id", "label": "readable name", "amount": number, "insight": "one warm sentence with emoji about this category" },
  "previousMonthComparison": { "percentChange": number, "summary": "friendly comparison sentence with emoji" },
  "savingSuggestions": ["tip 1 with emoji", "tip 2 with emoji", "tip 3 with emoji"],
  "budgetWarnings": ["warning with emoji or empty array if none"],
  "topRecommendations": ["actionable rec 1 with emoji", "rec 2 with emoji", "rec 3 with emoji"]
}

User data:
${JSON.stringify(context, null, 2)}`;

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are BudgetWow Buddy — a cheerful, emoji-friendly personal finance coach. You always respond with valid JSON only (no markdown fences). Use emojis generously in all text fields to make insights feel fun and approachable. Be accurate with numbers, kind in tone, and never preachy.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.55,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", await response.text());
      return buildFallbackInsights(context);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    if (parsed.highestCategory) {
      const cat = parsed.highestCategory;
      if (!cat.label && cat.name) {
        cat.label = categoryLabels[cat.name] || cat.name;
      }
      if (cat.amount == null && context.highestCategory) {
        cat.amount = context.highestCategory.amount;
      }
    }

    return {
      ...parsed,
      stats: context,
      generatedAt: new Date().toISOString(),
      poweredBy: "groq",
    };
  } catch (error) {
    console.error("Groq insights error:", error);
    return buildFallbackInsights(context);
  }
};

const buildFallbackInsights = (context) => {
  const warnings = [];
  if (context.budgetLimits?.monthly && context.thisMonthTotal > context.budgetLimits.monthly) {
    warnings.push(
      `Monthly spending (₹${context.thisMonthTotal.toFixed(0)}) passed your budget limit (₹${context.budgetLimits.monthly}) — time for a gentle reset! 🎯`
    );
  }
  if (context.budgetLimits?.daily) {
    warnings.push("Keep an eye on daily spending to stay within your daily budget limit! 👀");
  }

  const change = context.percentChange;
  const comparisonSummary =
    change > 0
      ? `📈 Spending is up ${change}% vs last month — a good time to review where it went! 💡`
      : change < 0
        ? `🎉 Awesome! You're down ${Math.abs(change)}% from last month — keep it up! 💪`
        : "📊 Spending looks similar to last month — steady as you go! ✨";

  return {
    monthlySummary: `Hey there! 👋 This month you've logged ₹${context.thisMonthTotal.toFixed(0)} across ${context.expenseCount} expense${context.expenseCount === 1 ? "" : "s"}. You're building great money awareness! 🌟`,
    highestCategory: context.highestCategory
      ? {
          name: context.highestCategory.id,
          label: context.highestCategory.label,
          amount: context.highestCategory.amount,
          insight: `🛍️ ${context.highestCategory.label} is your top category this month — worth a quick look to see if it matches your goals! 💡`,
        }
      : {
          name: "other",
          label: "Other",
          amount: 0,
          insight: "📝 No expenses yet this month — add some to unlock personalized tips! ✨",
        },
    previousMonthComparison: {
      percentChange: change,
      summary: comparisonSummary,
    },
    savingSuggestions: [
      "☕ Track small daily buys — those coffees add up faster than you think! 📉",
      "🎯 Set category budgets for your top 2 spending areas — small limits, big wins! 💰",
      "📱 Review subscriptions monthly — cancel what you don't use and save! 🙌",
    ],
    budgetWarnings: warnings.length
      ? warnings.map((w) => `⚠️ ${w}`)
      : [],
    topRecommendations: [
      "📸 Use AI receipt scanning to log expenses in seconds — less hassle, more clarity! ✨",
      "📅 Check your budget limits every Sunday — 5 minutes keeps you on track! 🗓️",
      "📊 Compare this month vs last on the dashboard — spot trends early! 🚀",
    ],
    stats: context,
    generatedAt: new Date().toISOString(),
    poweredBy: "local",
  };
};
