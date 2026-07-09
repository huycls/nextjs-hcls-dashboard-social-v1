const DEFAULT_BACKEND_BASE_URL = "http://localhost:5000";

export const BACKEND_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
  process.env.BACKEND_BASE_URL ??
  DEFAULT_BACKEND_BASE_URL
).replace(/\/$/, "");
