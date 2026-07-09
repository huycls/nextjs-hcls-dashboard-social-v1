import automationsData from "@/common/data/automations.json";
import type { AutomationCardItem } from "@/lib/automations/automations-snapshot";
import type { AppId } from "@/lib/automations/data";

type SnapshotWorkflow = {
  id: string;
  name: string;
  status: string;
  triggers: number;
  updatedAt: string;
  apps?: AppId[];
  runStatus?: "success" | "failed";
  runTimestamp?: string;
  taskCount?: number;
  userAvatarUrl?: string;
};

type AutomationsJson = {
  workflows: SnapshotWorkflow[];
};

const { workflows } = automationsData as AutomationsJson;

function toCardItem(workflow: SnapshotWorkflow): AutomationCardItem {
  return {
    id: workflow.id,
    runStatus:
      workflow.runStatus ??
      (workflow.status === "Failed" ? "failed" : "success"),
    title: workflow.name,
    timestamp:
      workflow.runTimestamp ??
      new Date(workflow.updatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    integrations: workflow.apps ?? [],
    taskCount: workflow.taskCount ?? workflow.triggers,
    userAvatarUrl:
      workflow.userAvatarUrl ??
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(workflow.id)}`,
  };
}

/** Static automation cards — dùng khi chưa có API hoặc cần mock UI nhanh */
export const MOCK_AUTOMATION_CARDS: AutomationCardItem[] =
  workflows.map(toCardItem);

export { workflows as MOCK_AUTOMATION_WORKFLOWS };
