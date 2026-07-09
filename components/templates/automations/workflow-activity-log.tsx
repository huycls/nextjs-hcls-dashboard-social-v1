"use client";

import { useEffect, useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { AppIcons } from "@/components/templates/automations/app-icons";
import {
  ActivityLogDot,
  ActivityLogStatusBadge,
} from "@/components/templates/automations/activity-log-status-badge";
import {
  ACTIVITY_LOG_LEVEL_LABELS,
  buildWorkflowActivitySummaries,
  filterLogsByLevel,
  filterSummariesByLevel,
  formatActivityRelativeTime,
  formatActivityTimestamp,
  getActivityLogsForWorkflow,
  type ActivityLogLevel,
} from "@/lib/automations/activity-logs";
import { useWorkflows } from "@/lib/automations/use-workflow-store";

const FILTER_OPTIONS: Array<{ id: ActivityLogLevel | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "success", label: "Success" },
  { id: "failed", label: "Failed" },
  { id: "running", label: "Running" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Info" },
];

export function WorkflowActivityLog() {
  const workflows = useWorkflows();
  const [levelFilter, setLevelFilter] = useState<ActivityLogLevel | "all">(
    "all",
  );
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null,
  );

  const summaries = useMemo(
    () => buildWorkflowActivitySummaries(workflows),
    [workflows],
  );

  const filteredSummaries = useMemo(
    () => filterSummariesByLevel(summaries, levelFilter),
    [summaries, levelFilter],
  );

  useEffect(() => {
    if (filteredSummaries.length === 0) {
      setSelectedWorkflowId(null);
      return;
    }

    const stillVisible = filteredSummaries.some(
      (summary) => summary.workflowId === selectedWorkflowId,
    );

    if (!selectedWorkflowId || !stillVisible) {
      setSelectedWorkflowId(filteredSummaries[0].workflowId);
    }
  }, [filteredSummaries, selectedWorkflowId]);

  const selectedSummary = filteredSummaries.find(
    (summary) => summary.workflowId === selectedWorkflowId,
  );

  const selectedLogs = useMemo(() => {
    if (!selectedWorkflowId) return [];
    return filterLogsByLevel(
      getActivityLogsForWorkflow(selectedWorkflowId),
      levelFilter,
    );
  }, [selectedWorkflowId, levelFilter]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-4 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setLevelFilter(option.id)}
              className={`rounded-lg border cursor-pointer hover:border-primary px-3 py-1.5 text-xs font-medium transition ${
                levelFilter === option.id
                  ? "border-primary bg-primary/10 text-heading"
                  : "border-border bg-surface-elevated text-muted hover:text-foreground"
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-border lg:w-[360px] lg:border-b-0 lg:border-r">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-heading">Workflows</h2>
            <p className="mt-1 text-xs text-muted">
              {filteredSummaries.length} workflow
              {filteredSummaries.length === 1 ? "" : "s"} with activity
            </p>
          </div>

          <ul className="max-h-[280px] overflow-y-auto lg:max-h-full lg:flex-1">
            {filteredSummaries.length === 0 ? (
              <li className="px-5 py-10 text-center text-sm text-muted">
                No activity logs match this filter.
              </li>
            ) : (
              filteredSummaries.map((summary) => {
                const isSelected = summary.workflowId === selectedWorkflowId;

                return (
                  <li key={summary.workflowId}>
                    <button
                      type="button"
                      onClick={() => setSelectedWorkflowId(summary.workflowId)}
                      className={`w-full border-b border-border px-5 py-4 text-left transition ${
                        isSelected ? "bg-primary/5" : "hover:bg-surface/60"
                      }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-heading">
                            {summary.workflowName}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted">
                            {summary.latestMessage}
                          </p>
                        </div>
                        <ActivityLogStatusBadge level={summary.latestLevel} />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        {summary.apps.length > 0 ? (
                          <AppIcons apps={summary.apps} />
                        ) : (
                          <span className="text-xs text-muted">No apps</span>
                        )}
                        <span className="shrink-0 text-xs text-muted">
                          {formatActivityRelativeTime(summary.latestTimestamp)}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          {selectedSummary ? (
            <>
              <div className="border-b border-border px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-heading">
                      {selectedSummary.workflowName}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {selectedSummary.logCount} log entr
                      {selectedSummary.logCount === 1 ? "y" : "ies"}
                      {levelFilter !== "all"
                        ? ` · filtered by ${ACTIVITY_LOG_LEVEL_LABELS[levelFilter]}`
                        : ""}
                    </p>
                  </div>
                  <ActivityLogStatusBadge level={selectedSummary.latestLevel} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {selectedLogs.length === 0 ? (
                  <p className="text-sm text-muted">
                    No logs for this filter in the selected workflow.
                  </p>
                ) : (
                  <ul className="space-y-0">
                    {selectedLogs.map((log, index) => (
                      <li
                        key={log.id}
                        className="relative flex gap-4 pb-6 last:pb-0">
                        {index < selectedLogs.length - 1 && (
                          <span
                            className="absolute left-[5px] top-4 h-[calc(100%-4px)] w-px bg-border"
                            aria-hidden="true"
                          />
                        )}
                        <ActivityLogDot level={log.level} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-heading">
                              {log.title}
                            </p>
                            <ActivityLogStatusBadge level={log.level} />
                          </div>
                          <p className="mt-1 text-sm text-foreground">
                            {log.message}
                          </p>
                          {log.detail && (
                            <p className="mt-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted">
                              {log.detail}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-muted">
                            {formatActivityTimestamp(log.timestamp)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <ScrollText className="h-10 w-10 text-muted" />
              <div>
                <p className="text-sm font-medium text-heading">
                  Select a workflow
                </p>
                <p className="mt-1 text-sm text-muted">
                  Choose a workflow from the list to view its activity logs.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
