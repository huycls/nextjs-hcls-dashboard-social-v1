const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "http://localhost:5000";

export const AUTOMATIONS_API = {
  baseUrl: BACKEND_BASE_URL.replace(/\/$/, ""),
  listPath: "/api/automations",
};

export function getAutomationsListUrl() {
  return `${AUTOMATIONS_API.baseUrl}${AUTOMATIONS_API.listPath}`;
}

export function getAutomationUrl(id: string) {
  return `${getAutomationsListUrl()}/${encodeURIComponent(id)}`;
}
