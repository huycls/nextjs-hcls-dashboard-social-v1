import type { WorkflowStatus } from "@/lib/automations/data";

export type WorkflowRunEnvironment = "test" | "production";

export const RUN_ENVIRONMENT_LABELS: Record<WorkflowRunEnvironment, string> = {
  test: "Test",
  production: "Production",
};

/** Draft/Paused/... → test webhook; Active → production webhook */
export function getWorkflowRunEnvironment(
  status: WorkflowStatus | undefined,
): WorkflowRunEnvironment {
  return status === "Active" ? "production" : "test";
}

export function shouldUseProductionWebhook(
  status: WorkflowStatus | undefined,
): boolean {
  return getWorkflowRunEnvironment(status) === "production";
}

export function getRunEnvironmentDescription(
  status: WorkflowStatus | undefined,
): string {
  if (status === "Active") {
    return "Approved workflow — runs use the production webhook.";
  }

  if (status === "Draft") {
    return "Draft workflow — runs are dry-run only via the test webhook.";
  }

  if (status === "Paused") {
    return "Paused workflow — runs use the test webhook until reactivated.";
  }

  return "Runs use the test webhook until this workflow is Active.";
}
