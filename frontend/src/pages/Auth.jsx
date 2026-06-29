import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaSmile,
  FaUsers,
} from "react-icons/fa";
import { authApi } from "../api/client";
import { API_BASE } from "../api/config";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const authError = searchParams.get("error");
  const { loginWithToken } = useAuth();

  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [oauthStatus, setOauthStatus] = useState({
    google: false,
    loading: true,
    backendReachable: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  useEffect(() => {
    let cancelled = false;

    const loadOAuthStatus = async () => {
      const maxAttempts = 4;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          const googleData = await authApi.googleStatus();

          if (cancelled) return;

          setOauthStatus({
            google: Boolean(googleData.configured),
            loading: false,
            backendReachable: true,
          });
          return;
        } catch {
          if (attempt < maxAttempts - 1) {
            await new Promise((resolve) => setTimeout(resolve, 700));
          }
        }
      }

      if (!cancelled) {
        setOauthStatus({
          google: false,
          loading: false,
          backendReachable: false,
        });
      }
    };

    loadOAuthStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authError) return;

    const messages = {
      google_cancelled: "Google sign-in was cancelled.",
      google_failed: "Google sign-in failed. Check backend Google OAuth settings.",
      google_not_configured: "Google sign-in is not configured on the server yet.",
      google_no_email: "Your Google account must have an email address.",
    };

    toast.error(messages[authError] || "Google sign-in failed.");

    const nextParams = new URLSearchParams();
    if (mode === "signup") nextParams.set("mode", "signup");
    const search = nextParams.toString();
    navigate({ pathname: "/auth", search: search ? `?${search}` : "" }, { replace: true });
  }, [authError, mode, navigate]);

  const handleToggle = (newState) => {
    if (newState !== isLogin) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsLogin(newState);
        const nextParams = new URLSearchParams();
        if (!newState) nextParams.set("mode", "signup");
        const search = nextParams.toString();
        navigate({ pathname: "/auth", search: search ? `?${search}` : "" }, { replace: true });
        setTimeout(() => setIsAnimating(false), 100);
      }, 300);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
      try {
        const { token, user } = await authApi.login(formData.email, formData.password);
        loginWithToken(token, user);
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } catch (error) {
        toast.error(error.message || "Failed to login. Please try again.");
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      try {
        const { token, user } = await authApi.register(formData.name, formData.email, formData.password);
        loginWithToken(token, user);
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } catch (error) {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = () => {
    if (!oauthStatus.google) {
      toast.error(
        oauthStatus.backendReachable
          ? "Google OAuth is not configured. Add credentials to backend/.env"
          : "Backend server is not reachable. Run npm run dev:backend"
      );
      return;
    }
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes" aria-hidden="true">
        <div className="auth-shape auth-shape--1" />
        <div className="auth-shape auth-shape--2" />
        <div className="auth-shape auth-shape--3" />
        <div className="auth-shape auth-shape--4" />
        <div className="auth-shape auth-shape--5" />
        <div className="auth-shape auth-shape--6" />
        <div className="auth-shape auth-shape--ring" />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff", borderRadius: "8px" },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />

      <button type="button" onClick={() => navigate("/")} className="auth-back-link">
        <span className="auth-back-link__icon" aria-hidden="true">
          <FaArrowLeft />
        </span>
        <span className="auth-back-link__text">Back to home</span>
      </button>

      <div className={`auth-live-border auth-card-enter ${!isLogin ? "auth-card-enter--signup" : ""}`}>
        <div className={`auth-card ${isLogin ? "auth-card--login" : "auth-card--signup"}`}>
        <aside className={`auth-promo-panel ${isLogin ? "auth-promo-panel--friend" : "auth-promo-panel--welcome"}`}>
          <div className={`auth-promo-body ${isAnimating ? "auth-promo-body--hide" : ""}`}>
            <div className="auth-promo-icon-wrap" aria-hidden="true">
              {isLogin ? (
                <FaSmile className="auth-promo-icon" />
              ) : (
                <FaUsers className="auth-promo-icon" />
              )}
            </div>

            {isLogin ? (
              <>
                <h2 className="auth-promo-title">Hello, Friend!</h2>
                <p className="auth-promo-text">
                  Enter your personal details and start your journey with smart AI budgeting.
                </p>
                <button type="button" onClick={() => handleToggle(false)} className="auth-promo-btn">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h2 className="auth-promo-title">Welcome Back!</h2>
                <p className="auth-promo-text">
                  To keep connected with us, please sign in with your personal info.
                </p>
                <button type="button" onClick={() => handleToggle(true)} className="auth-promo-btn">
                  Sign In
                </button>
              </>
            )}
          </div>

          <div className="auth-promo-floats" aria-hidden="true">
            <span className="auth-promo-float auth-promo-float--1" />
            <span className="auth-promo-float auth-promo-float--2" />
            <span className="auth-promo-float auth-promo-float--3" />
            <span className="auth-promo-float auth-promo-float--4" />
          </div>
        </aside>

        <main className="auth-form-panel">
          <div className={`auth-form-content ${isAnimating ? "auth-form-content--hide" : ""}`}>
            <div className="auth-form-heading">
              {isLogin ? (
                <>
                  <h1 className="auth-form-title">
                    Sign <span className="auth-form-title-gradient">In</span>
                  </h1>
                  <p className="auth-form-subtitle">Welcome back! Sign in with your email.</p>
                </>
              ) : (
                <>
                  <h1 className="auth-form-title">
                    Create <span className="auth-form-title-gradient">your account</span>
                  </h1>
                  <p className="auth-form-subtitle">Start your journey towards smarter budgeting.</p>
                </>
              )}
            </div>

            <div className="auth-social-row">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={oauthStatus.loading}
                className="auth-google-btn"
                aria-label="Continue with Google"
                title={oauthStatus.google ? "Continue with Google" : "Google sign-in unavailable"}
              >
                <span className="auth-google-btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </span>
                <span className="auth-google-btn-text">
                  {isLogin ? "Continue with Google" : "Sign up with Google"}
                </span>
              </button>
            </div>

            {oauthStatus.loading && (
              <p className="auth-oauth-notice auth-oauth-notice--info">Checking sign-in options...</p>
            )}

            {!oauthStatus.loading && !oauthStatus.backendReachable && (
              <p className="auth-oauth-notice">
                Backend server is not running. Start it with <code>npm run dev:backend</code>
              </p>
            )}

            {!oauthStatus.loading && oauthStatus.backendReachable && !oauthStatus.google && (
              <p className="auth-oauth-notice">Google sign-in needs OAuth in backend/.env</p>
            )}

            <p className="auth-divider-text">
              {isLogin ? "or use your email to sign in:" : "or use your email for registration:"}
            </p>

            <form onSubmit={handleSubmit} className="auth-form-fields">
              {!isLogin && (
                <div className={`auth-field-wrap ${isAnimating ? "auth-field-wrap--hide" : ""}`}>
                  <div className="auth-input-wrap">
                    <FaUser className="auth-field-icon" />
                    <input
                      type="text"
                      id="auth-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      className="auth-input"
                      placeholder="Name"
                    />
                  </div>
                </div>
              )}

              <div className="auth-input-wrap">
                <FaEnvelope className="auth-field-icon" />
                <input
                  type="email"
                  id="auth-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="auth-input"
                  placeholder="Email"
                />
              </div>

              <div className="auth-input-wrap">
                <FaLock className="auth-field-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="auth-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="auth-input auth-input--password"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="auth-eye-btn"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {!isLogin && (
                <div className={`auth-field-wrap ${isAnimating ? "auth-field-wrap--hide" : ""}`}>
                  <div className="auth-input-wrap">
                    <FaLock className="auth-field-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="auth-confirm-password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className="auth-input auth-input--password"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="auth-eye-btn"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className={`auth-remember-row ${isAnimating ? "auth-field-wrap--hide" : ""}`}>
                  <label htmlFor="auth-remember" className="auth-remember-label">
                    <input type="checkbox" id="auth-remember" className="auth-remember-check" defaultChecked />
                    Remember me
                  </label>
                  <a href="#" className="auth-forgot-link">
                    Forgot password?
                  </a>
                </div>
              )}

              <button type="submit" className="auth-submit-btn">
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <p className="auth-legal-text">
              By continuing, you agree to our{" "}
              <a href="#" className="auth-legal-link">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="auth-legal-link">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </main>
        </div>
      </div>
    </div>
  );
};

export default Auth;
