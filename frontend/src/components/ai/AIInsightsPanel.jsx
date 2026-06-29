import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BarChart3,
  Target,
  RefreshCw,
  Brain,
  Zap,
} from "lucide-react";
import { useInsights } from "../../hooks/useAI";
import { InsightsPageSkeleton } from "./AISkeleton";
import { formatCurrency } from "../../utils/expenses";

const CARD_STYLES = {
  blue: { variant: "ai-insight-card--blue", icon: "ai-insight-card__icon--blue" },
  expense: { variant: "ai-insight-card--violet", icon: "ai-insight-card__icon--violet" },
  green: { variant: "ai-insight-card--green", icon: "ai-insight-card__icon--green" },
  amber: { variant: "ai-insight-card--amber", icon: "ai-insight-card__icon--amber" },
  red: { variant: "ai-insight-card--red", icon: "ai-insight-card__icon--red" },
};

const InsightCard = ({ icon: Icon, title, emoji, children, accent = "expense", className = "" }) => {
  const styles = CARD_STYLES[accent] || CARD_STYLES.expense;

  return (
    <article className={`ai-insight-card accent-card ${styles.variant} ${className}`}>
      <header className="ai-insight-card__head">
        <div className={`ai-insight-card__icon ${styles.icon}`}>
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <div className="ai-insight-card__title-wrap">
          {emoji && <span className="ai-insight-card__emoji" aria-hidden="true">{emoji}</span>}
          <h3 className="ai-insight-card__title">{title}</h3>
        </div>
      </header>
      <div className="ai-insight-card__body">{children}</div>
    </article>
  );
};

const AIInsightsPanel = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useInsights();

  if (isLoading) {
    return (
      <div className="ai-insights-page">
        <div className="ai-insights-hero ai-insights-hero--loading">
          <div className="ai-insights-heading">
            <div className="ai-insights-heading__icon" aria-hidden="true">
              <Brain size={20} strokeWidth={2.25} />
            </div>
            <div>
              <h2 className="ai-insights-title">
                <span className="ai-insights-title__main">AI</span>{" "}
                <span className="ai-insights-title__accent">Insights</span>
              </h2>
              <p className="ai-insights-subtitle">✨ Groq AI is crunching your numbers…</p>
            </div>
          </div>
        </div>
        <InsightsPageSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="ai-insights-page">
        <div className="ai-insights-error">
          <div className="ai-insights-error__icon" aria-hidden="true">
            <AlertTriangle size={28} />
          </div>
          <p className="ai-insights-error__title">Oops! Couldn&apos;t load insights 😅</p>
          <p className="ai-insights-error__text">{error?.message || "Something went wrong. Try again!"}</p>
          <button type="button" onClick={() => refetch()} className="ai-insights-refresh-btn">
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const change = data.previousMonthComparison?.percentChange ?? 0;
  const isUp = change > 0;

  return (
    <div className="ai-insights-page">
      <header className="ai-insights-hero">
        <div className="ai-insights-heading">
          <div className="ai-insights-heading__icon" aria-hidden="true">
            <Brain size={20} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <div className="ai-insights-title-row">
              <h2 className="ai-insights-title">
                <span className="ai-insights-title__main">AI</span>{" "}
                <span className="ai-insights-title__accent">Insights</span>
              </h2>
              <span className="ai-insights-badge">
                <Sparkles size={11} />
                {data.poweredBy === "groq" ? "Groq AI" : "Smart Analytics"}
              </span>
            </div>
            <p className="ai-insights-subtitle">
              💡 Friendly spending tips, savings ideas & budget alerts — made just for you!
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="ai-insights-refresh-btn"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <div className="ai-insights-grid">
        <InsightCard
          icon={BarChart3}
          emoji="📊"
          title="Monthly Summary"
          accent="blue"
          className="ai-insight-card--wide"
        >
          <p className="ai-insight-text">{data.monthlySummary}</p>
          {data.stats && (
            <div className="ai-insight-stat ai-insight-stat--blue">
              <span className="ai-insight-stat__value">{formatCurrency(data.stats.thisMonthTotal)}</span>
              <span className="ai-insight-stat__label">this month 🗓️</span>
            </div>
          )}
        </InsightCard>

        <InsightCard icon={Target} emoji="🎯" title="Top Category" accent="expense">
          {data.highestCategory ? (
            <>
              <p className="ai-insight-highlight">{data.highestCategory.label}</p>
              <p className="ai-insight-amount">{formatCurrency(data.highestCategory.amount)}</p>
              <p className="ai-insight-text ai-insight-text--sm">{data.highestCategory.insight}</p>
            </>
          ) : (
            <p className="ai-insight-muted">No spending data yet — add expenses to get insights! 📝</p>
          )}
        </InsightCard>

        <InsightCard
          icon={isUp ? TrendingUp : TrendingDown}
          emoji={isUp ? "📈" : "📉"}
          title="vs Last Month"
          accent={isUp ? "amber" : "green"}
        >
          <p className={`ai-insight-change ${isUp ? "ai-insight-change--up" : "ai-insight-change--down"}`}>
            {isUp ? "+" : ""}
            {change}%
          </p>
          <p className="ai-insight-text ai-insight-text--sm">{data.previousMonthComparison?.summary}</p>
        </InsightCard>

        <InsightCard
          icon={Lightbulb}
          emoji="💰"
          title="Saving Suggestions"
          accent="green"
          className="ai-insight-card--wide"
        >
          <ul className="ai-insight-list">
            {(data.savingSuggestions || []).map((tip, i) => (
              <li key={i} className="ai-insight-list__item ai-insight-list__item--tip">
                <span className="ai-insight-list__bullet" aria-hidden="true">✨</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </InsightCard>

        {(data.budgetWarnings || []).length > 0 && (
          <InsightCard icon={AlertTriangle} emoji="⚠️" title="Budget Warnings" accent="red">
            <ul className="ai-insight-list">
              {data.budgetWarnings.map((warning, i) => (
                <li key={i} className="ai-insight-list__item ai-insight-list__item--warn">
                  <span className="ai-insight-list__bullet" aria-hidden="true">🚨</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </InsightCard>
        )}

        <InsightCard
          icon={Zap}
          emoji="🚀"
          title="Top Recommendations"
          accent="expense"
          className="ai-insight-card--full"
        >
          <div className="ai-insight-rec-grid">
            {(data.topRecommendations || []).map((rec, i) => (
              <div key={i} className="ai-insight-rec-card">
                <span className="ai-insight-rec-card__rank">#{i + 1}</span>
                <p className="ai-insight-rec-card__text">{rec}</p>
              </div>
            ))}
          </div>
        </InsightCard>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
