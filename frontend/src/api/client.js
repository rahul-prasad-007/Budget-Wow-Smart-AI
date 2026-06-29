import { API_BASE } from "./config";

const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const authApi = {
  register: (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  googleStatus: () => request("/auth/google/status"),
  me: () => request("/auth/me"),
};

export const expenseApi = {
  getAll: () => request("/expenses"),
  create: (expense) =>
    request("/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    }),
  update: (id, expense) =>
    request(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    }),
  delete: (id) =>
    request(`/expenses/${id}`, {
      method: "DELETE",
    }),
};

export const settingsApi = {
  get: () => request("/settings"),
  update: (limits) =>
    request("/settings", {
      method: "PUT",
      body: JSON.stringify({
        dailyLimit: limits.daily,
        monthlyLimit: limits.monthly,
        yearlyLimit: limits.yearly,
      }),
    }),
};

export const feedbackApi = {
  submit: (data) =>
    request("/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: () => request("/feedback"),
};
