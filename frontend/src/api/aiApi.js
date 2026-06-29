import axiosClient from "./axios";

export const receiptApi = {
  status: () => axiosClient.get("/receipts/status").then((r) => r.data),
  scan: (file) => {
    const formData = new FormData();
    formData.append("receipt", file);
    return axiosClient
      .post("/receipts/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

export const insightsApi = {
  get: () => axiosClient.get("/insights").then((r) => r.data),
};
