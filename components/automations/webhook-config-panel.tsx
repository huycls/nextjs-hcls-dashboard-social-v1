"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { triggerWorkflowJob } from "@/lib/automations/trigger-job";
import type { WorkflowNodeConfig } from "@/lib/automations/data";
import { incrementWorkflowTriggers } from "@/lib/automations/workflow-store";

type JobApiConfig = {
  runUrl: string;
  method: string;
  defaultWorkflowId: string;
};

type WebhookConfigPanelProps = {
  appWorkflowId: string;
  config: WorkflowNodeConfig;
  onChange: (config: WorkflowNodeConfig) => void;
  onClose: () => void;
};

export function WebhookConfigPanel({
  appWorkflowId,
  config,
  onChange,
  onClose,
}: WebhookConfigPanelProps) {
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [jobConfig, setJobConfig] = useState<JobApiConfig | null>(null);

  useEffect(() => {
    fetch("/api/jobs/config")
      .then((res) => res.json())
      .then((data: JobApiConfig) => setJobConfig(data))
      .catch(() => null);
  }, []);

  const jobWorkflowId =
    (config.workflowId ?? "").trim() ||
    jobConfig?.defaultWorkflowId ||
    "123";

  async function handleTrigger() {
    if (!config.topic.trim() || !jobWorkflowId) return;

    setTriggering(true);
    setTriggerResult(null);

    const result = await triggerWorkflowJob(
      jobWorkflowId,
      config.topic.trim(),
    );

    if (result.ok) {
      incrementWorkflowTriggers(appWorkflowId);
    }

    setTriggerResult({ ok: result.ok, message: result.message });
    setTriggering(false);
  }

  return (
    <aside className="flex w-[380px] shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-gray-900">Parameters</span>
          <span className="text-gray-400">Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h2 className="text-lg font-semibold text-gray-900">Trigger</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gửi job tới backend — backend sẽ gọi n8n workflow
        </p>

        <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs leading-5 text-sky-800">
          Next.js proxy →{" "}
          <code className="font-mono">
            {jobConfig?.runUrl ?? "http://localhost:5000/api/jobs/run"}
          </code>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              API Endpoint
            </p>
            <div className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700">
                {jobConfig?.method ?? "POST"}
              </span>
              <p className="break-all text-xs text-gray-600">
                {jobConfig?.runUrl ?? "Loading..."}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-3 text-sm font-medium text-gray-900">
              Request Body
            </p>

            <label
              htmlFor="job-workflow-id"
              className="mb-2 block text-sm font-medium text-gray-900">
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
              className="mb-4 h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />

            <label
              htmlFor="job-topic"
              className="mb-2 block text-sm font-medium text-gray-900">
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
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {triggerResult && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                triggerResult.ok
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                  : "border-red-100 bg-red-50 text-red-600"
              }`}>
              {triggerResult.message}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          Close
        </button>
        <button
          type="button"
          disabled={!config.topic.trim() || triggering}
          onClick={handleTrigger}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40">
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
