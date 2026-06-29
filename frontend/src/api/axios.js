import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const axiosClient = axios.create({
  baseURL: API_BASE,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
