const bubbleSets = {
  landing: [
    { size: 80, left: "8%", delay: 0, dur: 14, color: "rgba(99,102,241,0.35)" },
    { size: 50, left: "22%", delay: 3, dur: 11, color: "rgba(244,63,94,0.3)" },
    { size: 65, left: "45%", delay: 1, dur: 16, color: "rgba(14,165,233,0.3)" },
    { size: 40, left: "68%", delay: 5, dur: 10, color: "rgba(168,85,247,0.35)" },
    { size: 55, left: "85%", delay: 2, dur: 13, color: "rgba(16,185,129,0.3)" },
    { size: 35, left: "55%", delay: 7, dur: 9, color: "rgba(249,115,22,0.3)" },
  ],
  auth: [
    { size: 70, left: "12%", delay: 0, dur: 12, color: "rgba(168,85,247,0.32)" },
    { size: 45, left: "35%", delay: 4, dur: 15, color: "rgba(14,165,233,0.28)" },
    { size: 60, left: "60%", delay: 2, dur: 11, color: "rgba(16,185,129,0.3)" },
    { size: 38, left: "80%", delay: 6, dur: 13, color: "rgba(244,63,94,0.28)" },
  ],
  dashboard: [
    { size: 55, left: "5%", delay: 1, dur: 13, color: "rgba(16,185,129,0.3)" },
    { size: 42, left: "30%", delay: 4, dur: 11, color: "rgba(99,102,241,0.28)" },
    { size: 48, left: "70%", delay: 0, dur: 14, color: "rgba(14,165,233,0.3)" },
    { size: 36, left: "90%", delay: 5, dur: 10, color: "rgba(249,115,22,0.28)" },
  ],
  insights: [
    { size: 60, left: "10%", delay: 2, dur: 12, color: "rgba(236,72,153,0.3)" },
    { size: 45, left: "40%", delay: 0, dur: 14, color: "rgba(99,102,241,0.32)" },
    { size: 52, left: "65%", delay: 4, dur: 11, color: "rgba(6,182,212,0.3)" },
    { size: 38, left: "88%", delay: 6, dur: 13, color: "rgba(168,85,247,0.28)" },
  ],
  notfound: [
    { size: 65, left: "15%", delay: 1, dur: 13, color: "rgba(244,63,94,0.3)" },
    { size: 50, left: "50%", delay: 3, dur: 11, color: "rgba(99,102,241,0.3)" },
    { size: 40, left: "75%", delay: 0, dur: 15, color: "rgba(249,115,22,0.28)" },
  ],
};

const shapes = {
  landing: [
    { cls: "w-16 h-16 border-2 border-indigo-300/40 top-[48%] left-[8%] animate-shape-float-1 rounded-2xl rotate-12" },
    { cls: "w-10 h-10 bg-rose-300/30 top-[65%] right-[18%] animate-shape-float-2 rounded-full" },
    { cls: "w-12 h-12 border-2 border-sky-300/50 bottom-[18%] left-[8%] animate-shape-float-3 rounded-full" },
    { cls: "w-8 h-8 bg-amber-300/35 top-[55%] right-[10%] animate-shape-float-1 rounded-lg rotate-45" },
  ],
  auth: [
    { cls: "w-14 h-14 border-2 border-violet-300/45 top-[20%] right-[15%] animate-shape-float-2 rounded-full" },
    { cls: "w-10 h-10 bg-cyan-300/30 bottom-[30%] left-[10%] animate-shape-float-3 rounded-xl rotate-12" },
    { cls: "w-6 h-6 bg-emerald-300/40 top-[55%] right-[30%] animate-shape-float-1 rounded-full" },
  ],
  dashboard: [
    { cls: "w-12 h-12 border-2 border-emerald-300/40 top-[18%] right-[12%] animate-shape-float-1 rounded-xl" },
    { cls: "w-8 h-8 bg-sky-300/35 bottom-[20%] left-[15%] animate-shape-float-2 rounded-full" },
    { cls: "w-10 h-10 border-2 border-orange-300/40 top-[45%] left-[5%] animate-shape-float-3 rounded-lg rotate-45" },
  ],
  insights: [
    { cls: "w-14 h-14 border-2 border-pink-300/45 top-[12%] left-[8%] animate-shape-float-2 rounded-2xl rotate-6" },
    { cls: "w-9 h-9 bg-violet-300/35 bottom-[18%] right-[12%] animate-shape-float-1 rounded-full" },
    { cls: "w-11 h-11 border-2 border-cyan-300/40 top-[50%] right-[25%] animate-shape-float-3 rounded-xl" },
  ],
  notfound: [
    { cls: "w-12 h-12 border-2 border-rose-300/45 top-[25%] right-[20%] animate-shape-bounce rounded-2xl rotate-12" },
    { cls: "w-8 h-8 bg-indigo-300/35 bottom-[35%] left-[18%] animate-shape-bounce rounded-full" },
  ],
};

const sparkles = {
  landing: 18,
  auth: 12,
  dashboard: 10,
  insights: 14,
  notfound: 8,
};

const FloatingBubbles = ({ items }) => (
  <>
    {items.map((b, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-bubble-rise pointer-events-none"
        style={{
          width: b.size,
          height: b.size,
          left: b.left,
          background: `radial-gradient(circle at 35% 35%, ${b.color}, transparent 70%)`,
          animationDelay: `${b.delay}s`,
          animationDuration: `${b.dur}s`,
          boxShadow: `0 0 ${b.size / 2}px ${b.color}`,
        }}
      />
    ))}
  </>
);

const SparkleField = ({ count, seed = 0 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => {
      const left = ((i * 37 + seed * 13) % 95) + 2;
      const top = ((i * 53 + seed * 7) % 90) + 5;
      const delay = (i * 0.7) % 5;
      const dur = 2 + (i % 3);
      return (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white animate-sparkle pointer-events-none"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${dur}s`,
            boxShadow: "0 0 6px 2px rgba(99,102,241,0.5)",
          }}
        />
      );
    })}
  </>
);

const AnimatedBackground = ({ variant = "landing" }) => {
  const bubbles = bubbleSets[variant] || bubbleSets.landing;
  const shapeList = shapes[variant] || shapes.landing;
  const sparkleCount = sparkles[variant] || 12;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className={`absolute inset-0 bg-base-${variant}`} />
      <div className={`absolute inset-0 animate-aurora-shift bg-aurora-${variant}`} />
      <div className={`absolute inset-0 ${gridVariant[variant] || gridVariant.landing}`} />

      {/* Soft color orbs */}
      <div className={`absolute inset-0 orb-layer-${variant}`} />

      {/* Floating geometric shapes */}
      {shapeList.map((s, i) => (
        <div key={i} className={`absolute ${s.cls}`} />
      ))}

      {/* Rising bubbles */}
      <FloatingBubbles items={bubbles} />

      {/* Twinkling sparkles */}
      <SparkleField count={sparkleCount} seed={variant.length} />

      {/* Variant-specific extras */}
      {variant === "landing" && (
        <>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-wave-landing animate-wave-drift" />
          <div className="absolute top-[40%] left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent animate-stream-slide" />
        </>
      )}
      {variant === "auth" && (
        <div className="absolute inset-0 bg-ring-field opacity-60" />
      )}
      {variant === "dashboard" && (
        <>
          <div className="absolute inset-0 bg-dot-rain opacity-40" />
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-300/20 to-transparent animate-pulse-slow" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-sky-300/20 to-transparent animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        </>
      )}
      {variant === "insights" && (
        <>
          <div className="absolute inset-0 bg-data-stream opacity-30" />
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent animate-scan-sweep" />
        </>
      )}
      {variant === "notfound" && (
        <div className="absolute inset-0 bg-confetti-dots opacity-50" />
      )}

      <div className="absolute inset-0 bg-noise opacity-[0.025]" />
    </div>
  );
};

const gridVariant = {
  landing: "bg-grid-landing",
  auth: "bg-grid-auth",
  dashboard: "bg-grid-dashboard",
  insights: "bg-grid-insights",
  notfound: "bg-grid-notfound",
};

export default AnimatedBackground;
