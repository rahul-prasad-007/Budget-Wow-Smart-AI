import { createContext, useContext, useEffect, useState } from "react";
import { authApi, setToken } from "../api/client";

const AuthContext = createContext();
const USER_CACHE_KEY = "budgetwow_user";

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const cacheUser = (user) => {
  if (user) {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_CACHE_KEY);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        cacheUser(null);
        setLoading(false);
        return;
      }

      const cachedUser = readCachedUser();
      if (cachedUser) {
        setCurrentUser(cachedUser);
      }

      try {
        const { user } = await authApi.me();
        setCurrentUser(user);
        cacheUser(user);
      } catch {
        setToken(null);
        setCurrentUser(null);
        cacheUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginWithToken = (token, user) => {
    setToken(token);
    setCurrentUser(user);
    cacheUser(user);
  };

  const signOut = async () => {
    setToken(null);
    setCurrentUser(null);
    cacheUser(null);
    sessionStorage.removeItem("google_callback_lock");
  };

  const value = {
    currentUser,
    signOut,
    loginWithToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-expense mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
