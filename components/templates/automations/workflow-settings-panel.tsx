"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { WorkflowEnvironmentBadge } from "@/components/templates/automations/workflow-environment-badge";
import { WorkflowStatusBadge } from "@/components/templates/automations/workflow-status-badge";
import {
  WORKFLOW_STATUS_LABELS,
  type WorkflowNodeConfig,
} from "@/lib/automations/data";
import { isWorkflowStepConfigured } from "@/lib/automations/workflow-config";
import {
  getRunEnvironmentDescription,
  getWorkflowRunEnvironment,
  shouldUseProductionWebhook,
} from "@/lib/automations/workflow-environment";
import { triggerWorkflowJob } from "@/lib/automations/trigger-job";
import {
  CONFIGURABLE_NODE_META,
  type ConfigurableNodeId,
} from "@/lib/automations/workflow-templates";
import { updateWorkflowFromBackend } from "@/lib/automations/workflow-store";
import { useWorkflowPolling } from "@/lib/automations/use-workflow-polling";
import {
  notifyWorkflowStoreUpdated,
  useWorkflow,
} from "@/lib/automations/use-workflow-store";

import { DEFAULT_WORKFLOW_ID } from "@/lib/automations/jobs-server";

type WorkflowSettingsPanelProps = {
  appWorkflowId: string;
  config: WorkflowNodeConfig;
  configurableNodes: ConfigurableNodeId[];
  requiresTopic: boolean;
  onChange: (config: WorkflowNodeConfig) => void;
  onClose: () => void;
};

type CredentialNodeId = Exclude<ConfigurableNodeId, "webhook">;

function CredentialSection({
  nodeId,
  config,
  onChange,
}: {
  nodeId: CredentialNodeId;
  config: WorkflowNodeConfig;
  onChange: (config: WorkflowNodeConfig) => void;
}) {
  const meta = CONFIGURABLE_NODE_META[nodeId];
  const values = config.credentials[nodeId] ?? { apiKey: "", secretKey: "" };
  const isComplete = Boolean(values.apiKey && values.secretKey);

  function updateCredentials(patch: { apiKey?: string; secretKey?: string }) {
    onChange({
      ...config,
      credentials: {
        ...config.credentials,
        [nodeId]: { ...values, ...patch },
      },
    });
  }

  return (
    <section className="rounded-xl border border-border p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-heading">{meta.title}</h3>
        <p className="mt-1 text-xs text-muted">{meta.description}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor={`${nodeId}-api-key`}
            className="mb-2 block text-sm font-medium text-heading">
            API Key
          </label>
          <input
            id={`${nodeId}-api-key`}
            type="text"
            value={values.apiKey}
            onChange={(event) =>
              updateCredentials({ apiKey: event.target.value })
            }
            placeholder="Enter API key"
            className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor={`${nodeId}-secret-key`}
            className="mb-2 block text-sm font-medium text-heading">
            Secret Key
          </label>
          <input
            id={`${nodeId}-secret-key`}
            type="password"
            value={values.secretKey}
            onChange={(event) =>
              updateCredentials({ secretKey: event.target.value })
            }
            placeholder="Enter secret key"
            className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {!isComplete ? (
          <p className="text-xs text-amber-400">Credentials required.</p>
        ) : (
          <p className="text-xs text-[var(--node-green)]">Configured.</p>
        )}
      </div>
    </section>
  );
}

export function WorkflowSettingsPanel({
  appWorkflowId,
  config,
  configurableNodes,
  requiresTopic,
  onChange,
  onClose,
}: WorkflowSettingsPanelProps) {
  const workflow = useWorkflow(appWorkflowId);
  useWorkflowPolling(appWorkflowId);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const credentialNodes = configurableNodes.filter(
    (nodeId): nodeId is CredentialNodeId => nodeId !== "webhook",
  );

  const configuredCount = configurableNodes.filter((nodeId) =>
    isWorkflowStepConfigured(nodeId, config, requiresTopic),
  ).length;

  const runEnvironment = getWorkflowRunEnvironment(workflow?.status);
  const useProductionWebhook = shouldUseProductionWebhook(workflow?.status);
  const runButtonLabel =
    runEnvironment === "production" ? "Run in production" : "Run test";

  const jobWorkflowId =
    (config.workflowId ?? "").trim() || DEFAULT_WORKFLOW_ID;

  async function handleTrigger() {
    const topic = config.topic.trim();
    if (!jobWorkflowId || (requiresTopic && !topic)) return;

    setTriggering(true);
    setTriggerResult(null);

    const result = await triggerWorkflowJob(
      jobWorkflowId,
      requiresTopic ? topic : undefined,
      { useProductionWebhook },
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
        `${runEnvironment === "production" ? "Production" : "Test"} run`,
        result.ok
          ? statusLabel
            ? `Workflow: ${statusLabel}`
            : result.message
          : result.message,
        jobDetail,
      ]
        .filter(Boolean)
        .join(" — "),
    });
    setTriggering(false);
  }

  return (
    <aside className="flex w-[400px] shrink-0 flex-col border-l border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold text-heading">Settings</h2>
        <p className="mt-1 text-sm text-muted">
          {configuredCount}/{configurableNodes.length} steps configured
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <section className="rounded-xl border border-border p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-heading">Trigger</h3>
            <p className="mt-1 text-xs text-muted">
              {CONFIGURABLE_NODE_META.webhook.description}
            </p>
          </div>

          {workflow && (
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-muted">Run status</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {workflow.triggers} runs
                  </p>
                </div>
                <WorkflowStatusBadge status={workflow.status} />
              </div>

              <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-muted">Environment</p>
                  <WorkflowEnvironmentBadge environment={runEnvironment} />
                </div>
                <p className="mt-2 text-xs leading-5 text-foreground">
                  {getRunEnvironmentDescription(workflow.status)}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label
                htmlFor="settings-workflow-id"
                className="mb-2 block text-sm font-medium text-heading">
                Workflow ID
              </label>
              <input
                id="settings-workflow-id"
                type="text"
                value={config.workflowId ?? ""}
                onChange={(event) =>
                  onChange({ ...config, workflowId: event.target.value })
                }
                placeholder={DEFAULT_WORKFLOW_ID}
                className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {requiresTopic && (
              <div>
                <label
                  htmlFor="settings-topic"
                  className="mb-2 block text-sm font-medium text-heading">
                  Topic
                </label>
                <input
                  id="settings-topic"
                  type="text"
                  value={config.topic}
                  onChange={(event) =>
                    onChange({ ...config, topic: event.target.value })
                  }
                  placeholder="AI marketing trends 2026"
                  className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </div>
        </section>

        {credentialNodes.map((nodeId) => (
          <CredentialSection
            key={nodeId}
            nodeId={nodeId}
            config={config}
            onChange={onChange}
          />
        ))}

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
            triggering ||
            (requiresTopic && !config.topic.trim()) ||
            !jobWorkflowId
          }
          onClick={handleTrigger}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40">
          {triggering ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          {runButtonLabel}
        </button>
      </div>
    </aside>
  );
}
