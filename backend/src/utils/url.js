/** Strip trailing slashes so CORS origins and redirect URLs match browser values exactly. */
export const normalizeBaseUrl = (url, fallback = "") => {
  const value = (url || fallback).trim();
  return value.replace(/\/+$/, "");
};

export const getClientUrl = () =>
  normalizeBaseUrl(process.env.CLIENT_URL, "http://localhost:5173");

export const getApiUrl = () =>
  normalizeBaseUrl(
    process.env.API_URL,
    `http://localhost:${process.env.PORT || 5000}`
  );
