import React from "react";
import { ScanLine, Sparkles, Brain } from "lucide-react";
import HeroImageSlider from "./HeroImageSlider";
import { useLandingNavigation } from "../../hooks/useLandingNavigation";

const LandingHero = React.memo(() => {
  const { isLoggedIn, goToApp, exploreFeatures } = useLandingNavigation();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-32 lg:pt-24 pb-6 sm:pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-16 items-center">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 text-left md:pr-8 lg:pr-12 order-2 md:order-1">
            {/* Spacer on mobile — keeps logo separate; badges sit near heading */}
            <div className="min-h-[5rem] sm:min-h-[6rem] md:min-h-0 shrink-0" aria-hidden="true" />

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                <span className="ai-badge animate-float-badge">
                  <Sparkles size={12} /> AI-Powered
                </span>
                <span className="ai-badge">
                  <ScanLine size={12} /> Receipt Scanner
                </span>
                <span className="ai-badge">
                  <Brain size={12} /> Smart Insights
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-gray-900 leading-tight">
                Your Finances,{" "}
                <span className="ai-gradient-text">Supercharged by AI</span>
              </h2>
            </div>

            <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg max-w-xl">
              <p className="text-gray-600 leading-loose sm:leading-8">
                <span className="font-bold text-gray-900">BudgetWow Smart AI</span> scans receipts
                with{" "}
                <span className="font-semibold text-sky-700">Gemini Vision</span>, tracks expenses
                automatically, and delivers{" "}
                <span className="font-medium text-gray-800">personalized financial insights</span>{" "}
                powered by <span className="font-semibold text-violet-700">Groq AI</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2 md:pt-4">
              <button
                type="button"
                onClick={goToApp}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 ai-shimmer-btn text-white text-sm sm:text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all w-full sm:w-auto"
              >
                {isLoggedIn ? "Go to Dashboard" : "Start Free with AI"}
              </button>
              <button
                type="button"
                onClick={exploreFeatures}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 glass-card text-expense-dark text-sm sm:text-base md:text-lg font-semibold rounded-xl hover:shadow-md transition-all w-full sm:w-auto"
              >
                {isLoggedIn ? "Open Dashboard" : "Explore AI Features"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center order-1 md:order-2 mt-2 sm:mt-3 md:mt-0 mb-3 sm:mb-5 md:mb-0 px-3 sm:px-6 md:px-0 max-w-full">
            <HeroImageSlider />
          </div>
        </div>
      </div>
    </section>
  );
});

LandingHero.displayName = "LandingHero";
export default LandingHero;
