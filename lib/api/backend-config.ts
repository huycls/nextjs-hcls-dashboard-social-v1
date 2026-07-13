const DEFAULT_BACKEND_BASE_URL = "https://api.avispark.com";

/** Nest backend — used only on the server (BFF / Route Handlers). */
export const BACKEND_BASE_URL = (
  process.env.BACKEND_BASE_URL ??
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
  DEFAULT_BACKEND_BASE_URL
).replace(/\/$/, "");
