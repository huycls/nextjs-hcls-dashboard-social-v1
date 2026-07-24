import type { WorkflowStatus } from "@/lib/automations/data";

export type WorkflowRunEnvironment = "test" | "production";

export const RUN_ENVIRONMENT_LABELS: Record<WorkflowRunEnvironment, string> = {
  test: "Thử nghiệm",
  production: "Sản xuất",
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
    return "Workflow đã duyệt — các lượt chạy dùng webhook production.";
  }

  if (status === "Draft") {
    return "Workflow nháp — chỉ chạy thử qua webhook thử nghiệm.";
  }

  if (status === "Paused") {
    return "Workflow tạm dừng — dùng webhook thử nghiệm cho đến khi kích hoạt lại.";
  }

  return "Dùng webhook thử nghiệm cho đến khi workflow ở trạng thái Đang hoạt động.";
}
