import React from "react";
import { Toaster } from "react-hot-toast";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import LandingHeader from "../components/landing/LandingHeader";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingHowToUse from "../components/landing/LandingHowToUse";
import LandingTestimonials from "../components/landing/LandingTestimonials";
import LandingFeedbackForm from "../components/landing/LandingFeedbackForm";
import LandingFooter from "../components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="landing-page relative min-h-screen overflow-x-hidden">
      <AnimatedBackground variant="landing" />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff", borderRadius: "8px" },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingHowToUse />
      <LandingTestimonials />
      <LandingFeedbackForm />
      <LandingFooter />
    </div>
  );
};

export default Landing;
