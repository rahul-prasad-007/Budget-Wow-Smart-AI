import React from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <AnimatedBackground variant="notfound" />
      <div className="relative z-10 text-center max-w-lg glass-card rounded-3xl p-8 sm:p-10 hover-lift">
        <span className="ai-badge mb-4 inline-flex">404 — Page Not Found</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
          Lost in the <span className="ai-gradient-text">AI matrix</span>?
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          This page doesn't exist. Head back to BudgetWow Smart AI.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 ai-shimmer-btn text-white font-semibold rounded-xl"
        >
          Back to Home
        </button>
      </div>
      <div className="relative z-10 w-full max-w-md mt-8">
        <DotLottieReact
          src="https://lottie.host/432cca90-913a-4c7c-a46c-b9c10868af5f/0TyJBgYFAp.lottie"
          loop
          autoplay
          className="w-full h-64"
        />
      </div>
    </div>
  );
};

export default NotFound;
