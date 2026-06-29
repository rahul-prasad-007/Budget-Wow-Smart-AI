import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { LayoutDashboard, Sparkles, Home } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import titleIcon from "../assets/titleIcon.png";

const DashboardLayout = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { currentUser, signOut } = useAuth();
  const userName = currentUser?.displayName || currentUser?.name || currentUser?.email?.split("@")[0] || "User";
  const userPhoto = currentUser?.photoURL || null;
  const userInitial = (currentUser?.displayName || currentUser?.name || currentUser?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isInsights = location.pathname.includes("ai-insights");
  const bgVariant = isInsights ? "insights" : "dashboard";

  const renderAvatarContent = (variant = "trigger") => {
    const sizeClass =
      variant === "menu" ? "dash-user-avatar dash-user-avatar--menu" : "dash-user-avatar";

    if (userPhoto && !imageError) {
      return (
        <img
          src={userPhoto}
          alt={userName}
          className={sizeClass}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      );
    }

    return (
      <span
        className={`${sizeClass} dash-user-avatar--initial`}
        aria-label={variant === "trigger" ? userName : undefined}
        aria-hidden={variant === "menu" ? true : undefined}
      >
        {userInitial}
      </span>
    );
  };

  const renderUserAvatar = () => (
    <span className="dash-user-avatar-wrap">
      {renderAvatarContent("trigger")}
    </span>
  );

  const renderMenuAvatar = () => (
    <span className="dash-user-avatar-wrap dash-user-avatar-wrap--menu">
      {renderAvatarContent("menu")}
    </span>
  );

  const renderUserChevron = () => (
    <svg
      className={`dash-user-chevron ${showUserMenu ? "dash-user-chevron--open" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );

  useEffect(() => {
    setImageError(false);
  }, [currentUser?.uid, userPhoto]);

  useEffect(() => {
    if (!showUserMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 10);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setShowUserMenu(false);
      await signOut();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setShowUserMenu(false);
      toast.loading("Signing out...", { id: "add-account-toast" });
      await signOut();
      toast.success("Signed out. Redirecting...", { id: "add-account-toast" });
      setTimeout(() => {
        window.location.href = "/auth?mode=signup";
      }, 800);
    } catch (error) {
      toast.error("Failed to sign out. Please try again.", { id: "add-account-toast" });
    }
  };

  return (
    <div className="min-h-screen relative dashboard-shell">
      <AnimatedBackground variant={bgVariant} />
      <div className="relative z-10">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <header className="dash-header glass-card sticky top-0 z-40">
        <div className="dash-header__inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="dash-header__row">
            <div className="dash-header__brand">
              <span className="dash-header__logo-wrap" aria-hidden="true">
                <img
                  src={titleIcon}
                  alt="BudgetWow Smart AI"
                  className="dash-header__logo"
                />
              </span>
              <div className="dash-header__titles min-w-0">
                <h1 className="dash-header__title">
                  <span className="dash-header__title-main">BudgetWow</span>{" "}
                  <span className="dash-header__title-accent">Smart AI</span>
                </h1>
                <p className="dash-header__tagline dash-header__tagline--sm">
                  {isInsights ? "AI-powered financial intelligence" : "Scan receipts · Track · Get AI insights"}
                </p>
              </div>
            </div>

            <div className="dash-header__actions hidden md:flex">
              <p className="dash-header__tagline dash-header__tagline--lg">
                {isInsights ? "AI-powered financial intelligence" : "Scan receipts · Track · Get AI insights"}
              </p>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`dash-user-trigger dash-user-trigger--header ${showUserMenu ? "dash-user-trigger--open" : ""}`}
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  {renderUserAvatar()}
                  <span className="dash-user-trigger__name">{userName}</span>
                  {renderUserChevron()}
                </button>

                {showUserMenu && (
                  <div
                    className="dash-user-menu dash-user-menu--panel absolute right-0 mt-2 w-64 z-50"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="dash-user-menu__arrow" aria-hidden="true" />

                    <div className="dash-user-menu__head">
                      <div className="flex items-center gap-3">
                        {renderMenuAvatar()}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                          <p className="text-xs text-gray-500">{currentUser?.email || "Active User"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="dash-user-menu__body">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddAccount(e);
                        }}
                        className="dash-user-menu__item"
                      >
                        <FaUserPlus className="text-expense" />
                        <span>Add another account</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout(e);
                        }}
                        className="dash-user-menu__item dash-user-menu__item--danger"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden relative flex-shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`dash-user-trigger dash-user-trigger--compact ${showUserMenu ? "dash-user-trigger--open" : ""}`}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
                aria-label="User menu"
              >
                {renderUserAvatar()}
              </button>

              {showUserMenu && (
                <div
                  className="dash-user-menu dash-user-menu--panel absolute right-0 mt-2 w-64 z-50"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="dash-user-menu__arrow" aria-hidden="true" />

                  <div className="dash-user-menu__head">
                    <div className="flex items-center gap-3">
                      {renderMenuAvatar()}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500">{currentUser?.email || "Active User"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="dash-user-menu__body">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddAccount(e);
                      }}
                      className="dash-user-menu__item"
                    >
                      <FaUserPlus className="text-expense" />
                      <span>Add another account</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLogout(e);
                      }}
                      className="dash-user-menu__item dash-user-menu__item--danger"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="dash-nav glass-card" aria-label="Dashboard navigation">
        <div className="dash-nav__inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="dash-nav__track">
            <NavLink to="/" end className={({ isActive }) =>
              `dash-nav-link${isActive ? " dash-nav-link--active" : ""}`
            }>
              <Home size={16} strokeWidth={2.25} />
              Home
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) =>
              `dash-nav-link${isActive ? " dash-nav-link--active" : ""}`
            }>
              <LayoutDashboard size={16} strokeWidth={2.25} />
              Dashboard
            </NavLink>
            <NavLink to="/ai-insights" className={({ isActive }) =>
              `dash-nav-link dash-nav-link--insights${isActive ? " dash-nav-link--active" : ""}`
            }>
              <Sparkles size={16} strokeWidth={2.25} />
              AI Insights
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="glass-card border-t border-indigo-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            BudgetWow Smart AI &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
