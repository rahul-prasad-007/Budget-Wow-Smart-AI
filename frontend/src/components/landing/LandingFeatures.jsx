import React from "react";
import geminiLogo from "../../assets/GeminiLogo.png";

const features = [
  {
    title: "AI Receipt Scanner",
    desc: "Gemini Vision extracts merchant, amount, date & category from any receipt.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=240&h=240&q=80",
    ring: "ring-cyan-200",
    accent: "#06b6d4",
  },
  {
    title: "Groq AI Insights",
    desc: "Personalized spending tips, summaries & budget warnings from Llama 3.3.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=240&h=240&q=80",
    ring: "ring-violet-200",
    accent: "#8b5cf6",
  },
  {
    title: "Smart Categories",
    desc: "Auto-maps Uber → Transport, Starbucks → Food & more.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=240&h=240&q=80",
    ring: "ring-amber-200",
    accent: "#f59e0b",
  },
  {
    title: "Visual Analytics",
    desc: "Pie & bar charts to spot trends and compare months instantly.",
    image:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=240&h=240&q=80",
    ring: "ring-indigo-200",
    accent: "#6366f1",
  },
  {
    title: "Budget Guardrails",
    desc: "Daily, monthly & yearly limits with alerts before you overspend.",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=240&h=240&q=80",
    ring: "ring-emerald-200",
    accent: "#10b981",
  },
  {
    title: "Manual + AI Entry",
    desc: "Type expenses manually or let AI scan & fill — your choice.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=240&h=240&q=80",
    ring: "ring-fuchsia-200",
    accent: "#ec4899",
  },
];

const LandingFeatures = React.memo(() => {
  return (
    <section
      id="features"
      className="features-section relative w-full py-[120px] px-4 sm:px-6 lg:px-10 xl:px-16 overflow-hidden"
    >
      {/* Section-local animated background */}
      <div className="features-section-grid" aria-hidden="true" />
      <div className="features-blob features-blob-1" aria-hidden="true" />
      <div className="features-blob features-blob-2" aria-hidden="true" />
      <div className="features-blob features-blob-3" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        {/* Header — logo top center, copy below */}
        <header className="text-center mb-8 md:mb-10 lg:mb-11">
          <div className="flex justify-center mb-4 md:mb-5">
            <img
              src={geminiLogo}
              alt="Powered by Gemini and Groq"
              className="w-[min(100%,20rem)] sm:w-[22rem] md:w-[24rem] lg:w-[26rem] h-auto object-contain drop-shadow-md"
            />
          </div>

          <h3 className="features-heading w-full max-w-[1200px] mx-auto font-extrabold text-gray-900 leading-[1.1] tracking-tight lg:whitespace-nowrap">
            AI features that{" "}
            <span className="ai-gradient-text">actually save you time</span>
          </h3>

          <p className="features-subheading max-w-[700px] mx-auto mt-3 md:mt-4 text-gray-600 text-base sm:text-lg leading-relaxed">
            Receipt scanning to financial coaching —{" "}
            <span className="font-semibold text-gray-800">BudgetWow Smart AI</span> handles it all.
          </p>
        </header>

        {/* Feature cards — full-width responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 w-full">
          {features.map(({ title, desc, image, ring, accent }, index) => (
            <article
              key={title}
              className="accent-card accent-card--feature flex flex-row items-center gap-4 sm:gap-5 p-5 sm:p-6 md:p-7 min-h-[7.5rem] sm:min-h-[8.5rem]"
              style={{
                "--accent-color": accent,
                animationDelay: `${index * 0.08}s`,
              }}
            >
              <div
                className={`shrink-0 w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 lg:w-[5.5rem] lg:h-[5.5rem] rounded-full overflow-hidden border-[3px] border-white shadow-lg ring-2 ${ring}`}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-snug mb-1.5 sm:mb-2">
                  {title}
                </h4>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingFeatures.displayName = "LandingFeatures";
export default LandingFeatures;
