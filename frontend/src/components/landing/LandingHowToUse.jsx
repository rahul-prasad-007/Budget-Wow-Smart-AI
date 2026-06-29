import React from "react";
import { FaUserPlus, FaCamera, FaBrain, FaChartBar, FaWallet, FaFileDownload } from "react-icons/fa";
import { useLandingNavigation } from "../../hooks/useLandingNavigation";

const steps = [
  { num: 1, icon: FaUserPlus, color: "#2563eb", title: "Create Account", desc: "Sign up free — email or Google in seconds." },
  { num: 2, icon: FaCamera, color: "#16a34a", title: "Scan Receipts", desc: "Upload a bill photo — AI extracts every detail." },
  { num: 3, icon: FaChartBar, color: "#9333ea", title: "Track & Analyze", desc: "View charts, categories, and spending trends live." },
  { num: 4, icon: FaBrain, color: "#e11d48", title: "Get AI Insights", desc: "Groq AI delivers personalized financial advice." },
  { num: 5, icon: FaWallet, color: "#ea580c", title: "Set Budget Limits", desc: "Daily, monthly & yearly guardrails with warnings." },
  { num: 6, icon: FaFileDownload, color: "#0891b2", title: "Export & Review", desc: "Download PDF reports anytime." },
];

const LandingHowToUse = React.memo(() => {
  const { isLoggedIn, goToApp } = useLandingNavigation();

  return (
    <section id="how-to-use" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-3">
            How <span className="ai-gradient-text">BudgetWow Smart AI</span> works
          </h3>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-xl mx-auto">
            Six simple steps from receipt photo to AI-powered financial clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {steps.map(({ num, icon: Icon, color, title, desc }, index) => (
            <div
              key={num}
              className="how-step-card p-5 sm:p-6 text-center"
              style={{
                "--step-color": color,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                className="how-step-badge w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base mb-3 mx-auto"
                style={{ backgroundColor: color }}
              >
                {num}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon className="how-step-icon text-xl" style={{ color }} />
                <h4 className="font-bold text-gray-900 text-lg sm:text-xl md:text-2xl">{title}</h4>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={goToApp}
            className="px-8 py-3 ai-shimmer-btn text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            {isLoggedIn ? "Go to Dashboard" : "Try AI Receipt Scan — Free"}
          </button>
        </div>
      </div>
    </section>
  );
});

LandingHowToUse.displayName = "LandingHowToUse";
export default LandingHowToUse;
