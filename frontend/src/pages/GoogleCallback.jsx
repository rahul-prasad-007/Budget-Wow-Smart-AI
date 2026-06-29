import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi, setToken } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const CALLBACK_LOCK_KEY = "google_callback_lock";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const completeGoogleLogin = async () => {
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);
      const token = params.get("token");

      window.history.replaceState(null, "", window.location.pathname);

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      if (sessionStorage.getItem(CALLBACK_LOCK_KEY) === token) {
        navigate("/dashboard", { replace: true });
        return;
      }

      sessionStorage.setItem(CALLBACK_LOCK_KEY, token);

      try {
        setToken(token);
        const { user } = await authApi.me();
        loginWithToken(token, user);
        toast.success("Login successful!");
        navigate("/dashboard", { replace: true });
      } catch {
        setToken(null);
        sessionStorage.removeItem(CALLBACK_LOCK_KEY);
        toast.error("Google sign-in failed. Please try again.");
        navigate("/auth", { replace: true });
      }
    };

    completeGoogleLogin();
  }, [loginWithToken, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AnimatedBackground variant="auth" />
      <div className="relative z-10 text-center glass-card rounded-2xl p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-expense mx-auto"></div>
        <p className="mt-4 text-gray-600">Signing you into BudgetWow Smart AI...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
