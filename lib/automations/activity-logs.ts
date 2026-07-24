import activityLogsData from "@/common/data/automation-activity-logs.json";
import automationsData from "@/common/data/automations.json";
import type { AppId } from "@/lib/automations/data";

export type ActivityLogLevel =
  | "success"
  | "failed"
  | "running"
  | "warning"
  | "info";

export type ActivityLogEntry = {
  id: string;
  workflowId: string;
  timestamp: string;
  level: ActivityLogLevel;
  title: string;
  message: string;
  detail?: string;
};

export type WorkflowActivitySummary = {
  workflowId: string;
  workflowName: string;
  apps: AppId[];
  latestLevel: ActivityLogLevel;
  latestTitle: string;
  latestMessage: string;
  latestTimestamp: string;
  logCount: number;
};

export const ACTIVITY_LOG_LEVEL_LABELS: Record<ActivityLogLevel, string> = {
  success: "Thành công",
  failed: "Thất bại",
  running: "Đang chạy",
  warning: "Cảnh báo",
  info: "Thông tin",
};

type ActivityLogsFile = {
  logs: ActivityLogEntry[];
};

type AutomationsFile = {
  workflows: Array<{
    id: string;
    name: string;
    apps?: AppId[];
  }>;
};

const { logs: MOCK_ACTIVITY_LOGS } = activityLogsData as ActivityLogsFile;
const { workflows: MOCK_WORKFLOWS } = automationsData as AutomationsFile;

const workflowMeta = new Map(
  MOCK_WORKFLOWS.map((workflow) => [
    workflow.id,
    { name: workflow.name, apps: workflow.apps ?? [] },
  ]),
);

function formatLogTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRelativeTime(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return formatLogTimestamp(timestamp);
}

export function getMockActivityLogs(): ActivityLogEntry[] {
  return [...MOCK_ACTIVITY_LOGS].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export function getActivityLogsForWorkflow(workflowId: string): ActivityLogEntry[] {
  return getMockActivityLogs().filter((log) => log.workflowId === workflowId);
}

export function buildWorkflowActivitySummaries(
  workflows: Array<{ id: string; name: string; apps?: AppId[] }> = [],
): WorkflowActivitySummary[] {
  const sourceWorkflows = workflows.length > 0 ? workflows : MOCK_WORKFLOWS;
  const logsByWorkflow = new Map<string, ActivityLogEntry[]>();

  for (const log of getMockActivityLogs()) {
    const existing = logsByWorkflow.get(log.workflowId) ?? [];
    existing.push(log);
    logsByWorkflow.set(log.workflowId, existing);
  }

  const workflowIds = new Set([
    ...sourceWorkflows.map((workflow) => workflow.id),
    ...logsByWorkflow.keys(),
  ]);

  const summaries: WorkflowActivitySummary[] = [];

  for (const workflowId of workflowIds) {
    const workflowLogs = logsByWorkflow.get(workflowId) ?? [];
    if (workflowLogs.length === 0) continue;

    const latest = workflowLogs[0];
    const fromStore = sourceWorkflows.find(
      (workflow) => workflow.id === workflowId,
    );
    const fromMock = workflowMeta.get(workflowId);

    summaries.push({
      workflowId,
      workflowName: fromStore?.name ?? fromMock?.name ?? "Workflow không xác định",
      apps: fromStore?.apps ?? fromMock?.apps ?? [],
      latestLevel: latest.level,
      latestTitle: latest.title,
      latestMessage: latest.message,
      latestTimestamp: latest.timestamp,
      logCount: workflowLogs.length,
    });
  }

  return summaries.sort(
    (a, b) =>
      new Date(b.latestTimestamp).getTime() -
      new Date(a.latestTimestamp).getTime(),
  );
}

export function formatActivityTimestamp(timestamp: string) {
  return formatLogTimestamp(timestamp);
}

export function formatActivityRelativeTime(timestamp: string) {
  return formatRelativeTime(timestamp);
}

export function filterSummariesByLevel(
  summaries: WorkflowActivitySummary[],
  level: ActivityLogLevel | "all",
) {
  if (level === "all") return summaries;
  return summaries.filter((summary) => summary.latestLevel === level);
}

export function filterLogsByLevel(
  logs: ActivityLogEntry[],
  level: ActivityLogLevel | "all",
) {
  if (level === "all") return logs;
  return logs.filter((log) => log.level === level);
}
