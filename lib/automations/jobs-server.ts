import { getProxyApiUrl } from "@/lib/api/client-api";

export const DEFAULT_WORKFLOW_ID =
  process.env.NEXT_PUBLIC_DEFAULT_WORKFLOW_ID ??
  process.env.DEFAULT_WORKFLOW_ID ??
  "123";

export const JOBS_API = {
  method: "POST" as const,
  listPath: "/api/jobs",
  runPath: "/api/jobs/run",
};

export function getJobsListUrl() {
  return getProxyApiUrl(JOBS_API.listPath);
}

export function getJobUrl(id: string) {
  return `${getJobsListUrl()}/${encodeURIComponent(id)}`;
}

export function getJobsRunUrl() {
  return getProxyApiUrl(JOBS_API.runPath);
}
