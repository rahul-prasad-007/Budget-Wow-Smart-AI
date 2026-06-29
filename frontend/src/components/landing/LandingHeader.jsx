import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";
import { useLandingNavigation } from "../../hooks/useLandingNavigation";

/**
 * LandingHeader Component
 *
 * Header navigation bar for the landing page.
 * Shows Sign Up / Login for guests; user info + Dashboard for logged-in users.
 */
const LandingHeader = React.memo(() => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, goToDashboard, goToApp, goToLogin } = useLandingNavigation();
  const [imageError, setImageError] = useState(false);

  const userName =
    currentUser?.displayName ||
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";
  const userPhoto = currentUser?.photoURL || null;
  const userInitial = userName.trim().charAt(0).toUpperCase();

  useEffect(() => {
    setImageError(false);
  }, [currentUser?.uid, userPhoto]);

  return (
    <header className="absolute top-0 left-0 right-0 z-10 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-shrink-0"
            aria-label="BudgetWow home"
          >
            <img
              src={logoImage}
              alt="BudgetWow Smart AI Logo"
              className="h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto object-contain flex-shrink-0 max-h-[60px] sm:max-h-[80px] md:max-h-[100px] lg:max-h-none"
            />
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 landing-header-actions">
              <div className="landing-user-chip hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-indigo-200/70 shadow-sm">
                {userPhoto && !imageError ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="landing-user-chip__avatar"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="landing-user-chip__initial" aria-hidden="true">
                    {userInitial}
                  </span>
                )}
                <span className="landing-user-chip__name text-sm font-semibold text-gray-800 max-w-[8rem] truncate">
                  {userName}
                </span>
              </div>
              <button
                type="button"
                onClick={goToDashboard}
                className="px-2.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 ai-shimmer-btn text-white rounded-xl text-xs sm:text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap"
              >
                Dashboard
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0 landing-header-actions">
              <button
                type="button"
                onClick={goToApp}
                className="px-2.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-expense border-2 border-indigo-300/60 bg-white/80 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 text-xs sm:text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={goToLogin}
                className="px-2.5 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 ai-shimmer-btn text-white rounded-xl text-xs sm:text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

LandingHeader.displayName = "LandingHeader";

export default LandingHeader;
