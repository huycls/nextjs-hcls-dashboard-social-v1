import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { AppId } from "@/lib/automations/data";
import type { BackendWorkflow } from "@/lib/automations/automations-api";

export const AUTOMATIONS_SNAPSHOT_PATH = join(
  process.cwd(),
  "common/data/automations.json",
);

export type AutomationRunStatus = "success" | "failed";

/** Card display fields for desktop/mobile automation list */
export type AutomationCardItem = {
  id: string;
  runStatus: AutomationRunStatus;
  title: string;
  timestamp: string;
  integrations: AppId[];
  taskCount: number;
  userAvatarUrl: string;
};

export type AutomationSnapshotWorkflow = BackendWorkflow & {
  runStatus?: AutomationRunStatus;
  runTimestamp?: string;
  taskCount?: number;
  userAvatarUrl?: string;
};

export type AutomationsSnapshotFile = {
  generatedAt: string | null;
  workflows: AutomationSnapshotWorkflow[];
};

function toCardItem(workflow: AutomationSnapshotWorkflow): AutomationCardItem {
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

export function readAutomationsSnapshot(): AutomationSnapshotWorkflow[] {
  try {
    if (!existsSync(AUTOMATIONS_SNAPSHOT_PATH)) {
      return [];
    }

    const raw = readFileSync(AUTOMATIONS_SNAPSHOT_PATH, "utf-8");
    const parsed = JSON.parse(raw) as AutomationsSnapshotFile;

    if (!Array.isArray(parsed?.workflows)) {
      return [];
    }

    return parsed.workflows;
  } catch (error) {
    console.error(
      "[lib/automations] Failed to read automations.json snapshot:",
      error,
    );
    return [];
  }
}

export function getAutomationCardsFromSnapshot(): AutomationCardItem[] {
  return readAutomationsSnapshot().map(toCardItem);
}

export function getAutomationFromSnapshot(
  id: string,
): AutomationSnapshotWorkflow | null {
  return readAutomationsSnapshot().find((workflow) => workflow.id === id) ?? null;
}
