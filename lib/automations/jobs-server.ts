const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "http://localhost:5000";

export const DEFAULT_WORKFLOW_ID =
  process.env.DEFAULT_WORKFLOW_ID ?? "123";

export const JOBS_API = {
  method: "POST" as const,
  listPath: "/api/jobs",
  runPath: "/api/jobs/run",
  baseUrl: BACKEND_BASE_URL.replace(/\/$/, ""),
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
