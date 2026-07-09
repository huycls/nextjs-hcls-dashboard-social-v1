import { BACKEND_BASE_URL } from "@/lib/api/backend-config";

export const AUTOMATIONS_API = {
  baseUrl: BACKEND_BASE_URL,
  listPath: "/api/automations",
};

export function getAutomationsListUrl() {
  return `${AUTOMATIONS_API.baseUrl}${AUTOMATIONS_API.listPath}`;
}

export function getAutomationUrl(id: string) {
  return `${getAutomationsListUrl()}/${encodeURIComponent(id)}`;
}
