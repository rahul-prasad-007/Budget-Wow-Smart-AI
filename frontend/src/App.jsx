import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import GoogleCallback from "./pages/GoogleCallback";
import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";
import AllFeedbacks from "./pages/AllFeedbacks";
import NotFound from "./pages/NotFound";

/**
 * ProtectedRoute Component
 * 
 * This component protects routes that require authentication.
 * - Shows loading spinner while checking auth status
 * - Redirects to /auth if user is not logged in
 * - Allows access if user is authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-expense mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/auth" replace />;
};

/**
 * PublicRoute Component
 * 
 * This component handles public routes (like login/signup).
 * - Shows loading spinner while checking auth status
 * - Redirects to /dashboard if user is already logged in
 * - Allows access if user is not authenticated
 */
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-expense mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? <Navigate to="/dashboard" replace /> : children;
};

/**
 * AppRoutes Component
 * 
 * Defines all application routes:
 * - "/" - Landing page (public)
 * - "/auth" - Login/Signup page (public, redirects if logged in)
 * - "/dashboard" - Main dashboard (protected, requires login)
 * - "*" - 404 Not Found page (catches all unmatched routes)
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feedbacks" element={<AllFeedbacks />} />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/google/callback"
        element={<GoogleCallback />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <AIInsights />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * Main App Component
 * 
 * Wraps the entire application with:
 * - BrowserRouter: Enables client-side routing
 * - AuthProvider: Provides authentication context to all components
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
