import { useMutation, useQuery } from "@tanstack/react-query";
import { receiptApi, insightsApi } from "../api/aiApi";

export const useReceiptScan = () =>
  useMutation({
    mutationFn: (file) => receiptApi.scan(file),
  });

export const useReceiptStatus = () =>
  useQuery({
    queryKey: ["receipt-status"],
    queryFn: receiptApi.status,
    staleTime: 60_000,
  });

export const useInsights = () =>
  useQuery({
    queryKey: ["ai-insights"],
    queryFn: insightsApi.get,
    staleTime: 5 * 60_000,
    retry: 1,
  });
