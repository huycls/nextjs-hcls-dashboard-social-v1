"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { triggerWorkflowJob } from "@/lib/automations/trigger-job";
import { WORKFLOW_STATUS_LABELS, type WorkflowNodeConfig } from "@/lib/automations/data";
import { updateWorkflowFromBackend } from "@/lib/automations/workflow-store";
import {
  notifyWorkflowStoreUpdated,
  useWorkflow,
} from "@/lib/automations/use-workflow-store";
import { useWorkflowPolling } from "@/lib/automations/use-workflow-polling";
import { WorkflowStatusBadge } from "@/components/automations/workflow-status-badge";

type JobApiConfig = {
  runUrl: string;
  method: string;
  defaultWorkflowId: string;
};

type WebhookConfigPanelProps = {
  appWorkflowId: string;
  config: WorkflowNodeConfig;
  requiresTopic: boolean;
  onChange: (config: WorkflowNodeConfig) => void;
  onClose: () => void;
};

export function WebhookConfigPanel({
  appWorkflowId,
  config,
  requiresTopic,
  onChange,
  onClose,
}: WebhookConfigPanelProps) {
  const workflow = useWorkflow(appWorkflowId);
  useWorkflowPolling(appWorkflowId);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{
    ok: boolean;
    message: string;
    workflowStatus?: string;
  } | null>(null);
  const [jobConfig, setJobConfig] = useState<JobApiConfig | null>(null);

  useEffect(() => {
    fetch("/api/jobs/config")
      .then((res) => res.json())
      .then((data: JobApiConfig) => setJobConfig(data))
      .catch(() => null);
  }, []);

  const jobWorkflowId =
    (config.workflowId ?? "").trim() || jobConfig?.defaultWorkflowId || "123";

  async function handleTrigger() {
    const topic = config.topic.trim();
    if (!jobWorkflowId || (requiresTopic && !topic)) return;

    setTriggering(true);
    setTriggerResult(null);

    const result = await triggerWorkflowJob(
      jobWorkflowId,
      requiresTopic ? topic : undefined,
    );

    if (result.workflow) {
      updateWorkflowFromBackend(result.workflow);
      notifyWorkflowStoreUpdated();
    }

    const statusLabel = result.workflow
      ? WORKFLOW_STATUS_LABELS[result.workflow.status]
      : undefined;

    const jobDetail = result.job?.errorMessage
      ? result.job.errorMessage
      : result.job?.status
        ? `Job: ${result.job.status}`
        : undefined;

    setTriggerResult({
      ok: result.ok,
      message: [
        result.ok
          ? statusLabel
            ? `Workflow: ${statusLabel}`
            : result.message
          : result.message,
        jobDetail,
      ]
        .filter(Boolean)
        .join(" — "),
      workflowStatus: statusLabel,
    });
    setTriggering(false);
  }

  return (
    <aside className="flex w-[380px] shrink-0 flex-col border-l border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-heading">Parameters</span>
          <span className="text-[#333333]d">Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h2 className="text-lg font-semibold text-heading">Trigger</h2>
        <p className="mt-1 text-sm text-[#333333]d">
          Gửi job tới backend — backend sẽ gọi n8n workflow
        </p>

        <div className="mt-4 rounded-xl border border-[var(--node-blue-border)] bg-[var(--node-blue-bg)] px-4 py-3 text-xs leading-5 text-[var(--node-blue)]">
          Next.js proxy →{" "}
          <code className="font-mono">
            {jobConfig?.runUrl ?? "http://localhost:5000/api/jobs/run"}
          </code>
        </div>

        {workflow && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
            <div>
              <p className="text-xs font-medium text-muted">Trạng thái thực hiện</p>
              <p className="mt-0.5 text-sm text-foreground">
                {workflow.triggers} lần kích hoạt
              </p>
            </div>
            <WorkflowStatusBadge status={workflow.status} />
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#333333]d">
              API Endpoint
            </p>
            <div className="flex items-start gap-2 rounded-xl border border-border bg-surface-elevated p-3">
              <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                {jobConfig?.method ?? "POST"}
              </span>
              <p className="break-all text-xs text-foreground">
                {jobConfig?.runUrl ?? "Loading..."}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="mb-3 text-sm font-medium text-heading">
              Request Body
            </p>

            <label
              htmlFor="job-workflow-id"
              className="mb-2 block text-sm font-medium text-heading">
              workflowId
            </label>
            <input
              id="job-workflow-id"
              type="text"
              value={config.workflowId ?? ""}
              onChange={(event) =>
                onChange({ ...config, workflowId: event.target.value })
              }
              placeholder={jobConfig?.defaultWorkflowId ?? "123"}
              className="mb-4 h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />

            {requiresTopic && (
              <>
                <label
                  htmlFor="job-topic"
                  className="mb-2 block text-sm font-medium text-heading">
                  topic
                </label>
                <input
                  id="job-topic"
                  type="text"
                  value={config.topic}
                  onChange={(event) =>
                    onChange({ ...config, topic: event.target.value })
                  }
                  placeholder="AI marketing trends 2026"
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </>
            )}
          </div>

          {triggerResult && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                triggerResult.ok
                  ? "border-[var(--node-green-border)] bg-[var(--node-green-bg)] text-[var(--node-green)]"
                  : "border-rose-500/20 bg-rose-500/10 text-rose-400"
              }`}>
              {triggerResult.message}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-elevated">
          Close
        </button>
        <button
          type="button"
          disabled={
            triggering || (requiresTopic && !config.topic.trim()) || !jobWorkflowId
          }
          onClick={handleTrigger}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40">
          {triggering ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          Kích hoạt workflow
        </button>
      </div>
    </aside>
  );
}
