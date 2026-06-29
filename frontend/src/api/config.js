/** Shared API base — set VITE_API_URL in Vercel (production) or use /api with Vite proxy (local dev). */
export const API_BASE = import.meta.env.VITE_API_URL || "/api";
