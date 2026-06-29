import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Landing-page navigation that respects login state:
 * logged-in users go to the dashboard; guests go to auth or scroll sections.
 */
export const useLandingNavigation = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isLoggedIn = Boolean(currentUser);

  const goToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const goToApp = useCallback(() => {
    navigate(isLoggedIn ? "/dashboard" : "/auth?mode=signup");
  }, [isLoggedIn, navigate]);

  const goToLogin = useCallback(() => {
    navigate(isLoggedIn ? "/dashboard" : "/auth?mode=login");
  }, [isLoggedIn, navigate]);

  const exploreFeatures = useCallback(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
      return;
    }
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  }, [isLoggedIn, navigate]);

  return {
    currentUser,
    isLoggedIn,
    goToApp,
    goToLogin,
    goToDashboard,
    exploreFeatures,
  };
};
