"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Unplug, Zap } from "lucide-react";
import { WorkflowEnvironmentBadge } from "@/components/templates/automations/workflow-environment-badge";
import { WorkflowStatusBadge } from "@/components/templates/automations/workflow-status-badge";
import {
  WORKFLOW_STATUS_LABELS,
  normalizeWorkflowCredentials,
  type WorkflowCredentials,
  type WorkflowNodeConfig,
} from "@/lib/automations/data";
import {
  clearGoogleOAuthReturnParam,
  disconnectGoogleIntegration,
  fetchGoogleAuthUrl,
  fetchGoogleIntegrationStatus,
  readGoogleOAuthReturnParam,
  updateGoogleSpreadsheetId,
} from "@/lib/automations/google-integration";
import {
  hasGoogleSheetReady,
  hasOpenRouterCredentials,
  hasWorkflowCredentials,
  isWorkflowStepConfigured,
} from "@/lib/automations/workflow-config";
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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function CredentialsSection({
  credentials,
  googleLoading,
  googleMessage,
  onPatch,
  onConnectGoogle,
  onDisconnectGoogle,
  onSaveSpreadsheet,
}: {
  credentials: WorkflowCredentials;
  googleLoading: boolean;
  googleMessage: { ok: boolean; text: string } | null;
  onPatch: (patch: Partial<WorkflowCredentials>) => void;
  onConnectGoogle: () => void;
  onDisconnectGoogle: () => void;
  onSaveSpreadsheet: () => void;
}) {
  const openRouterReady = hasOpenRouterCredentials(credentials);
  const googleReady = hasGoogleSheetReady(credentials);

  return (
    <section className="rounded-xl border border-border p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-heading">Credentials</h3>
        <p className="mt-1 text-xs text-muted">
          OpenRouter for generation. Google Sheets connection is stored on the
          backend — tokens never stay in the browser.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="openrouter-api-key"
            className="mb-2 block text-sm font-medium text-heading">
            OpenRouter API Key
          </label>
          <input
            id="openrouter-api-key"
            type="password"
            autoComplete="off"
            value={credentials.openRouterApiKey}
            onChange={(event) =>
              onPatch({ openRouterApiKey: event.target.value })
            }
            placeholder="sk-or-..."
            className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="openrouter-model"
            className="mb-2 block text-sm font-medium text-heading">
            Model
          </label>
          <input
            id="openrouter-model"
            type="text"
            value={credentials.model}
            onChange={(event) => onPatch({ model: event.target.value })}
            placeholder="openai/gpt-4o-mini"
            className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="rounded-xl border border-border bg-surface-elevated p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-heading">Google Sheets</p>
              {credentials.googleConnected ? (
                <p className="mt-1 truncate text-xs text-node-green">
                  Connected
                  {credentials.googleEmail
                    ? ` · ${credentials.googleEmail}`
                    : ""}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted">
                  Connect once. Backend keeps the refresh token.
                </p>
              )}
            </div>

            {credentials.googleConnected ? (
              <button
                type="button"
                disabled={googleLoading}
                onClick={onDisconnectGoogle}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-surface disabled:opacity-40">
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                  <Unplug className="h-4 w-4 shrink-0" />
                )}
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                disabled={googleLoading}
                onClick={onConnectGoogle}
                className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border bg-surface px-3 text-sm font-medium text-heading transition hover:bg-background disabled:opacity-40 sm:w-auto">
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                  <GoogleIcon className="h-4 w-4 shrink-0" />
                )}
                Sign in with Google
              </button>
            )}
          </div>

          {credentials.googleConnected && (
            <div className="mt-3 space-y-2">
              <label
                htmlFor="spreadsheet-id"
                className="block text-xs font-medium text-muted">
                Spreadsheet ID
              </label>
              <div className="flex gap-2">
                <input
                  id="spreadsheet-id"
                  type="text"
                  value={credentials.spreadsheetId}
                  onChange={(event) =>
                    onPatch({ spreadsheetId: event.target.value })
                  }
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="h-9 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  disabled={googleLoading || !credentials.spreadsheetId.trim()}
                  onClick={onSaveSpreadsheet}
                  className="h-9 shrink-0 rounded-lg bg-primary px-3 text-xs font-medium text-background transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40">
                  Save
                </button>
              </div>
              <p className="text-[11px] text-muted">
                From the sheet URL: docs.google.com/spreadsheets/d/
                <span className="text-foreground">SPREADSHEET_ID</span>/edit
              </p>
            </div>
          )}
        </div>

        {googleMessage && (
          <p
            className={`text-xs ${
              googleMessage.ok ? "text-[var(--node-green)]" : "text-rose-400"
            }`}>
            {googleMessage.text}
          </p>
        )}

        {!openRouterReady || !googleReady ? (
          <p className="text-xs text-amber-400">
            {!openRouterReady
              ? "OpenRouter API key and model required."
              : "Connect Google and set a spreadsheet ID."}
          </p>
        ) : (
          <p className="text-xs text-[var(--node-green)]">
            Credentials ready.
          </p>
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
  const credentials = normalizeWorkflowCredentials(config.credentials);
  const configRef = useRef(config);
  const onChangeRef = useRef(onChange);
  configRef.current = config;
  onChangeRef.current = onChange;

  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleMessage, setGoogleMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const configuredCount = configurableNodes.filter((nodeId) =>
    isWorkflowStepConfigured(nodeId, config, requiresTopic),
  ).length;

  const runEnvironment = getWorkflowRunEnvironment(workflow?.status);
  const useProductionWebhook = shouldUseProductionWebhook(workflow?.status);
  const runButtonLabel =
    runEnvironment === "production" ? "Run in production" : "Run test";

  const jobWorkflowId =
    (config.workflowId ?? "").trim() || DEFAULT_WORKFLOW_ID;

  function patchCredentials(patch: Partial<WorkflowCredentials>) {
    const current = configRef.current;
    const currentCredentials = normalizeWorkflowCredentials(
      current.credentials,
    );
    onChangeRef.current({
      ...current,
      credentials: { ...currentCredentials, ...patch },
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function syncGoogleStatus() {
      const oauthReturn = readGoogleOAuthReturnParam(
        new URLSearchParams(window.location.search),
      );

      try {
        const status = await fetchGoogleIntegrationStatus();
        if (cancelled) return;

        const current = configRef.current;
        const currentCredentials = normalizeWorkflowCredentials(
          current.credentials,
        );

        onChangeRef.current({
          ...current,
          credentials: {
            ...currentCredentials,
            googleConnected: status.connected,
            googleEmail: status.email ?? "",
            spreadsheetId:
              status.spreadsheetId?.trim() || currentCredentials.spreadsheetId,
          },
        });

        if (oauthReturn === "connected") {
          setGoogleMessage({
            ok: true,
            text: "Google account connected. Tokens are stored on the backend.",
          });
        } else if (oauthReturn === "error") {
          setGoogleMessage({
            ok: false,
            text: "Google connection failed. Try again.",
          });
        }
      } catch (error) {
        if (cancelled) return;
        if (oauthReturn === "error") {
          setGoogleMessage({
            ok: false,
            text: "Google connection failed. Try again.",
          });
        } else if (oauthReturn === "connected") {
          setGoogleMessage({
            ok: false,
            text:
              error instanceof Error
                ? error.message
                : "Connected, but status sync failed.",
          });
        }
      } finally {
        clearGoogleOAuthReturnParam();
      }
    }

    void syncGoogleStatus();

    return () => {
      cancelled = true;
    };
  }, [appWorkflowId]);

  async function handleConnectGoogle() {
    setGoogleLoading(true);
    setGoogleMessage(null);

    const returnUrl = window.location.href.split("?")[0] ?? window.location.href;
    const result = await fetchGoogleAuthUrl(returnUrl);

    if (!result.ok || !result.authUrl) {
      setGoogleMessage({
        ok: false,
        text:
          result.message ??
          "Backend Google OAuth is not available yet. Implement GET /api/integrations/google/auth-url.",
      });
      setGoogleLoading(false);
      return;
    }

    window.location.assign(result.authUrl);
  }

  async function handleDisconnectGoogle() {
    setGoogleLoading(true);
    setGoogleMessage(null);

    const result = await disconnectGoogleIntegration();
    setGoogleLoading(false);

    if (!result.ok) {
      setGoogleMessage({
        ok: false,
        text: result.message ?? "Could not disconnect Google.",
      });
      return;
    }

    patchCredentials({
      googleConnected: false,
      googleEmail: "",
    });
    setGoogleMessage({ ok: true, text: "Google disconnected." });
  }

  async function handleSaveSpreadsheet() {
    const spreadsheetId = credentials.spreadsheetId.trim();
    if (!spreadsheetId) return;

    setGoogleLoading(true);
    setGoogleMessage(null);

    const result = await updateGoogleSpreadsheetId(spreadsheetId);
    setGoogleLoading(false);

    if (!result.ok) {
      setGoogleMessage({
        ok: false,
        text: result.message ?? "Could not save spreadsheet ID on backend.",
      });
      return;
    }

    patchCredentials({
      spreadsheetId: result.status?.spreadsheetId ?? spreadsheetId,
      googleConnected: result.status?.connected ?? true,
      googleEmail: result.status?.email ?? credentials.googleEmail,
    });
    setGoogleMessage({ ok: true, text: "Spreadsheet ID saved." });
  }

  async function handleTrigger() {
    const topic = config.topic.trim();
    if (!jobWorkflowId || (requiresTopic && !topic)) return;
    if (!hasWorkflowCredentials(credentials)) {
      setTriggerResult({
        ok: false,
        message: "Configure OpenRouter and Google Sheets before running.",
      });
      return;
    }

    setTriggering(true);
    setTriggerResult(null);

    const result = await triggerWorkflowJob(
      jobWorkflowId,
      requiresTopic ? topic : undefined,
      {
        useProductionWebhook,
        credentials: {
          openRouterApiKey: credentials.openRouterApiKey,
          model: credentials.model,
          spreadsheetId: credentials.spreadsheetId,
        },
      },
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

        <CredentialsSection
          credentials={credentials}
          googleLoading={googleLoading}
          googleMessage={googleMessage}
          onPatch={patchCredentials}
          onConnectGoogle={handleConnectGoogle}
          onDisconnectGoogle={handleDisconnectGoogle}
          onSaveSpreadsheet={handleSaveSpreadsheet}
        />

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
            !jobWorkflowId ||
            !hasWorkflowCredentials(credentials)
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
