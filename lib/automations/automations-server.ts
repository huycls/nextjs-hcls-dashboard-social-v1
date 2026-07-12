import { getProxyApiUrl } from "@/lib/api/client-api";

export const AUTOMATIONS_API = {
  listPath: "/api/automations",
};

export function getAutomationsListUrl() {
  return getProxyApiUrl(AUTOMATIONS_API.listPath);
}

export function getAutomationUrl(id: string) {
  return `${getAutomationsListUrl()}/${encodeURIComponent(id)}`;
}
