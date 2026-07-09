import { BACKEND_BASE_URL } from "@/lib/api/backend-config";

export const DEFAULT_WORKFLOW_ID =
  process.env.NEXT_PUBLIC_DEFAULT_WORKFLOW_ID ??
  process.env.DEFAULT_WORKFLOW_ID ??
  "123";

export const JOBS_API = {
  method: "POST" as const,
  listPath: "/api/jobs",
  runPath: "/api/jobs/run",
  baseUrl: BACKEND_BASE_URL,
};

export function getJobsListUrl() {
  return `${JOBS_API.baseUrl}${JOBS_API.listPath}`;
}

export function getJobUrl(id: string) {
  return `${getJobsListUrl()}/${encodeURIComponent(id)}`;
}

export function getJobsRunUrl() {
  return `${JOBS_API.baseUrl}${JOBS_API.runPath}`;
}
