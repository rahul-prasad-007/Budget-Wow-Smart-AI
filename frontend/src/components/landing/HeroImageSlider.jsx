import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { ScanLine, BarChart3, Wallet, Sparkles, TrendingUp, Bell } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    tag: "AI Receipt Scanner",
    title: "Scan receipts in seconds",
    subtitle: "Powered by Gemini Vision",
    icon: ScanLine,
    gradient: "from-indigo-600/80 via-violet-600/60 to-transparent",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    tag: "Live Analytics",
    title: "Visualize your spending",
    subtitle: "Charts & category breakdowns",
    icon: BarChart3,
    gradient: "from-sky-600/80 via-cyan-600/60 to-transparent",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=80",
    tag: "Smart Budgeting",
    title: "Stay within your limits",
    subtitle: "Daily, monthly & yearly guardrails",
    icon: Wallet,
    gradient: "from-emerald-600/80 via-teal-600/60 to-transparent",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    tag: "Groq AI Insights",
    title: "Personalized finance tips",
    subtitle: "Savings suggestions & alerts",
    icon: Sparkles,
    gradient: "from-rose-600/80 via-pink-600/60 to-transparent",
  },
];

const statCards = [
  { icon: Bell, label: "3 Alerts", sub: "Budget warnings", accent: "#f59e0b" },
  { icon: TrendingUp, label: "76% On Track", sub: "This month", accent: "#10b981" },
  { icon: ScanLine, label: "12 Receipts", sub: "Scanned today", accent: "#6366f1" },
];

const HeroImageSlider = React.memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-md lg:max-w-lg mx-auto">
      <div className="accent-card accent-card--hero p-1 sm:p-1.5 md:p-2 overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop
          speed={800}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="hero-image-swiper rounded-2xl overflow-hidden"
        >
          {slides.map((slide) => {
            const Icon = slide.icon;
            return (
              <SwiperSlide key={slide.id}>
                <div className="relative aspect-[5/2] sm:aspect-[21/9] md:aspect-[2/1] w-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover scale-105 hero-slide-img"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-[9px] sm:text-[10px] font-semibold mb-1">
                      <Icon size={10} />
                      {slide.tag}
                    </span>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold leading-tight">{slide.title}</h3>
                    <p className="text-[10px] sm:text-xs text-white/85 mt-0.5">{slide.subtitle}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Stat rows — stacked below slider, no overlap */}
        <div className="flex flex-col gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 px-0.5 sm:px-1 pb-0.5">
          {statCards.map(({ icon: Icon, label, sub, accent }) => (
            <div
              key={label}
              className="accent-card accent-card--mini flex items-center gap-2 px-2 py-1.5 sm:px-2.5 sm:py-2 w-full"
              style={{ "--accent-color": accent }}
            >
              <div
                className="p-1 sm:p-1.5 rounded-md shrink-0"
                style={{ backgroundColor: `color-mix(in srgb, ${accent} 18%, white)`, color: accent }}
              >
                <Icon size={12} className="sm:w-[14px] sm:h-[14px]" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[11px] sm:text-xs font-bold text-gray-900 leading-none truncate">{label}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature chips below slider */}
      <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3 px-0.5">
        {slides.map((slide, i) => {
          const Icon = slide.icon;
          const isActive = activeIndex === i;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className={`hero-slider-chip inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-expense text-white shadow-md shadow-indigo-200 scale-105"
                  : "bg-white/90 text-gray-600 border border-indigo-100 hover:border-indigo-200"
              }`}
              aria-label={slide.tag}
            >
              <Icon size={10} className="sm:w-3 sm:h-3" />
              {slide.tag.split(" ")[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
});

HeroImageSlider.displayName = "HeroImageSlider";
export default HeroImageSlider;
