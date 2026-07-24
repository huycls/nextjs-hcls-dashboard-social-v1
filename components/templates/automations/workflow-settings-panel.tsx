"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Circle, Loader2, Save, Unplug, Zap } from "lucide-react";
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
import { saveWorkflowNodeConfig } from "@/lib/automations/save-node-config";
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
import { cn } from "@/lib/utils/tailwind-merge";

export const NODE_CONFIG_SECTION_ID = (nodeId: ConfigurableNodeId) =>
  `node-config-${nodeId}`;

type WorkflowSettingsPanelProps = {
  appWorkflowId: string;
  config: WorkflowNodeConfig;
  configurableNodes: ConfigurableNodeId[];
  requiresTopic: boolean;
  focusedNodeId?: ConfigurableNodeId | null;
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

function NodeSectionShell({
  nodeId,
  title,
  description,
  configured,
  focused,
  children,
}: {
  nodeId: ConfigurableNodeId;
  title: string;
  description: string;
  configured: boolean;
  focused: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={NODE_CONFIG_SECTION_ID(nodeId)}
      className={cn(
        "scroll-mt-4 rounded-xl border p-4 transition",
        focused ? "border-primary/50 ring-2 ring-primary/20" : "border-border",
      )}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium",
            configured
              ? "bg-[var(--node-green-bg)] text-[var(--node-green)]"
              : "bg-amber-500/10 text-amber-500",
          )}>
          {configured ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <Circle className="h-3.5 w-3.5" />
          )}
          {configured ? "Sẵn sàng" : "Bắt buộc"}
        </span>
      </div>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-heading">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function OpenRouterFields({
  credentials,
  idPrefix,
  onPatch,
}: {
  credentials: WorkflowCredentials;
  idPrefix: string;
  onPatch: (patch: Partial<WorkflowCredentials>) => void;
}) {
  return (
    <div className="space-y-3">
      <Field
        id={`${idPrefix}-api-key`}
        label="OpenRouter API Key"
        type="password"
        autoComplete="off"
        value={credentials.openRouterApiKey}
        placeholder="sk-or-..."
        onChange={(value) => onPatch({ openRouterApiKey: value })}
      />
      <Field
        id={`${idPrefix}-model`}
        label="Mô hình"
        value={credentials.model}
        placeholder="openai/gpt-4o-mini"
        onChange={(value) => onPatch({ model: value })}
      />
      {hasOpenRouterCredentials(credentials) ? (
        <p className="text-xs text-[var(--node-green)]">OpenRouter đã sẵn sàng.</p>
      ) : (
        <p className="text-xs text-amber-400">
          Cần OpenRouter API key và model.
        </p>
      )}
    </div>
  );
}

function GoogleSheetFields({
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
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-surface-elevated p-3">
        <div className="flex flex-col gap-3 sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-heading">Google Sheets</p>
            {credentials.googleConnected ? (
              <p className="mt-1 truncate text-xs text-node-green">
                Đã kết nối
                {credentials.googleEmail ? ` · ${credentials.googleEmail}` : ""}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted">
                Kết nối một lần. Backend lưu refresh token.
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
              Ngắt kết nối
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
              Đăng nhập bằng Google
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
                Lưu
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Từ URL bảng tính: docs.google.com/spreadsheets/d/
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

      {hasGoogleSheetReady(credentials) ? (
        <p className="text-xs text-[var(--node-green)]">Google Sheets đã sẵn sàng.</p>
      ) : (
        <p className="text-xs text-amber-400">
          Kết nối Google và nhập Spreadsheet ID.
        </p>
      )}
    </div>
  );
}

export function WorkflowSettingsPanel({
  appWorkflowId,
  config,
  configurableNodes,
  requiresTopic,
  focusedNodeId = null,
  onChange,
  onClose,
}: WorkflowSettingsPanelProps) {
  const workflow = useWorkflow(appWorkflowId);
  useWorkflowPolling(appWorkflowId);
  const credentials = normalizeWorkflowCredentials(config.credentials);
  const configRef = useRef(config);
  const onChangeRef = useRef(onChange);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  configRef.current = config;
  onChangeRef.current = onChange;

  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleCredentialId, setGoogleCredentialId] = useState(
    () => config.credentialRefs?.googleCredentialId?.trim() ?? "",
  );
  const [googleMessage, setGoogleMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const configuredCount = configurableNodes.filter((nodeId) =>
    isWorkflowStepConfigured(nodeId, config, requiresTopic),
  ).length;

  const hasGemini = configurableNodes.includes("gemini-model");
  const hasOpenRouterNode = configurableNodes.includes("openrouter-model");
  const openRouterOwner: ConfigurableNodeId = hasGemini
    ? "gemini-model"
    : "openrouter-model";

  const runEnvironment = getWorkflowRunEnvironment(workflow?.status);
  const useProductionWebhook = shouldUseProductionWebhook(workflow?.status);
  const runButtonLabel =
    runEnvironment === "production" ? "Chạy production" : "Chạy thử";

  const jobWorkflowId = (config.workflowId ?? "").trim() || DEFAULT_WORKFLOW_ID;

  useEffect(() => {
    const nextGoogleId = config.credentialRefs?.googleCredentialId?.trim() ?? "";
    if (nextGoogleId) {
      setGoogleCredentialId(nextGoogleId);
    }
  }, [config.credentialRefs?.googleCredentialId]);

  function patchCredentialRefs(
    patch: Partial<NonNullable<typeof config.credentialRefs>>,
  ) {
    const current = configRef.current;
    onChangeRef.current({
      ...current,
      credentialRefs: {
        ...current.credentialRefs,
        ...patch,
      },
    });
  }

  async function linkGoogleCredentialToJob(credentialId: string) {
    const trimmed = credentialId.trim();
    if (!trimmed || !appWorkflowId) return;

    setGoogleCredentialId(trimmed);
    patchCredentialRefs({ googleCredentialId: trimmed });

    const current = configRef.current;
    const currentCredentials = normalizeWorkflowCredentials(
      current.credentials,
    );

    await saveWorkflowNodeConfig(
      appWorkflowId,
      {
        topic: current.topic,
        credentials: {
          openRouterApiKey: currentCredentials.openRouterApiKey,
          model: currentCredentials.model,
          spreadsheetId: currentCredentials.spreadsheetId,
        },
        credentialRefs: {
          ...current.credentialRefs,
          googleCredentialId: trimmed,
        },
      },
      null,
    );
  }

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
    if (!focusedNodeId) return;
    const section = document.getElementById(
      NODE_CONFIG_SECTION_ID(focusedNodeId),
    );
    section?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [focusedNodeId]);

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
          credentialRefs: status.credentialId
            ? {
                ...current.credentialRefs,
                googleCredentialId: status.credentialId,
              }
            : current.credentialRefs,
        });

        if (status.credentialId?.trim()) {
          setGoogleCredentialId(status.credentialId.trim());
        }

        if (oauthReturn === "connected" && status.credentialId?.trim()) {
          await linkGoogleCredentialToJob(status.credentialId);
        }

        if (oauthReturn === "connected") {
          setGoogleMessage({
            ok: true,
            text: "Đã kết nối tài khoản Google. Token được lưu trên backend.",
          });
        } else if (oauthReturn === "error") {
          setGoogleMessage({
            ok: false,
            text: "Kết nối Google thất bại. Vui lòng thử lại.",
          });
        }
      } catch (error) {
        if (cancelled) return;
        if (oauthReturn === "error") {
          setGoogleMessage({
            ok: false,
            text: "Kết nối Google thất bại. Vui lòng thử lại.",
          });
        } else if (oauthReturn === "connected") {
          setGoogleMessage({
            ok: false,
            text:
              error instanceof Error
                ? error.message
                : "Đã kết nối nhưng đồng bộ trạng thái thất bại.",
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

    const returnUrl =
      window.location.href.split("?")[0] ?? window.location.href;
    const result = await fetchGoogleAuthUrl(returnUrl);

    if (!result.ok || !result.authUrl) {
      setGoogleMessage({
        ok: false,
        text:
          result.message ??
          "Google OAuth trên backend chưa sẵn sàng. Triển khai GET /api/integrations/google/auth-url.",
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
        text: result.message ?? "Không thể ngắt kết nối Google.",
      });
      return;
    }

    patchCredentials({
      googleConnected: false,
      googleEmail: "",
    });
    setGoogleMessage({ ok: true, text: "Đã ngắt kết nối Google." });
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
        text: result.message ?? "Không thể lưu Spreadsheet ID trên backend.",
      });
      return;
    }

    patchCredentials({
      spreadsheetId: result.status?.spreadsheetId ?? spreadsheetId,
      googleConnected: result.status?.connected ?? true,
      googleEmail: result.status?.email ?? credentials.googleEmail,
    });
    setGoogleMessage({ ok: true, text: "Đã lưu Spreadsheet ID." });
  }

  async function handleSaveConfig() {
    // Save lên automation job (appWorkflowId), không phải workflow type
    if (!appWorkflowId) {
      setSaveResult({ ok: false, message: "Cần có Job ID." });
      return;
    }

    setSaving(true);
    setSaveResult(null);

    const result = await saveWorkflowNodeConfig(appWorkflowId, {
      topic: config.topic,
      credentials: {
        openRouterApiKey: credentials.openRouterApiKey,
        model: credentials.model,
        spreadsheetId: credentials.spreadsheetId,
      },
      credentialRefs: {
        ...config.credentialRefs,
        ...(googleCredentialId
          ? { googleCredentialId }
          : {}),
      },
    });

    if (result.workflow) {
      updateWorkflowFromBackend({
        ...result.workflow,
        id: appWorkflowId,
        config: {
          ...result.workflow.config,
          workflowId:
            config.workflowId ||
            result.workflow.config?.workflowId ||
            jobWorkflowId,
          topic: config.topic,
          credentialRefs: result.workflow.config?.credentialRefs,
          credentials: normalizeWorkflowCredentials({
            ...result.workflow.config?.credentials,
            googleConnected: credentials.googleConnected,
            googleEmail: credentials.googleEmail,
          }),
        },
      });
      notifyWorkflowStoreUpdated();

      const savedGoogleId =
        result.workflow.config?.credentialRefs?.googleCredentialId?.trim();
      if (savedGoogleId) {
        setGoogleCredentialId(savedGoogleId);
      }
    }

    setSaveResult({ ok: result.ok, message: result.message });
    setSaving(false);
  }

  async function handleTrigger() {
    const topic = config.topic.trim();
    if (!jobWorkflowId || (requiresTopic && !topic)) return;
    if (!hasWorkflowCredentials(credentials)) {
      setTriggerResult({
        ok: false,
        message: "Cấu hình OpenRouter và Google Sheets trước khi chạy.",
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
        `${runEnvironment === "production" ? "Chạy production" : "Chạy thử"}`,
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

  function renderNodeFields(nodeId: ConfigurableNodeId) {
    if (nodeId === "webhook") {
      return (
        <div className="space-y-3">
          {workflow && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface-elevated px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-muted">Trạng thái chạy</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {workflow.triggers} lượt chạy
                  </p>
                </div>
                <WorkflowStatusBadge status={workflow.status} />
              </div>

              <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-muted">Môi trường</p>
                  <WorkflowEnvironmentBadge environment={runEnvironment} />
                </div>
                <p className="mt-2 text-xs leading-5 text-foreground">
                  {getRunEnvironmentDescription(workflow.status)}
                </p>
              </div>
            </div>
          )}

          <Field
            id="settings-workflow-id"
            label="Workflow ID"
            value={config.workflowId ?? ""}
            placeholder={DEFAULT_WORKFLOW_ID}
            onChange={(value) => onChange({ ...config, workflowId: value })}
          />

          {requiresTopic && (
            <Field
              id="settings-topic"
              label="Chủ đề"
              value={config.topic}
              placeholder="Xu hướng marketing AI 2026"
              onChange={(value) => onChange({ ...config, topic: value })}
            />
          )}
        </div>
      );
    }

    if (nodeId === "gemini-model" || nodeId === "openrouter-model") {
      const isOwner = nodeId === openRouterOwner;
      const sharesWithOther =
        hasGemini && hasOpenRouterNode && nodeId !== openRouterOwner;

      if (sharesWithOther) {
        const ready = hasOpenRouterCredentials(credentials);
        return (
          <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3">
            <p className="text-sm text-foreground">
              Dùng chung thông tin xác thực OpenRouter với{" "}
              <span className="font-medium text-heading">
                {CONFIGURABLE_NODE_META[openRouterOwner].title}
              </span>
              .
            </p>
            <p
              className={`mt-2 text-xs ${
                ready ? "text-[var(--node-green)]" : "text-amber-400"
              }`}>
              {ready
                ? "Thông tin xác thực dùng chung đã sẵn sàng."
                : "Cấu hình OpenRouter trong Cài đặt AI phía trên."}
            </p>
          </div>
        );
      }

      if (isOwner) {
        return (
          <OpenRouterFields
            credentials={credentials}
            idPrefix={nodeId}
            onPatch={patchCredentials}
          />
        );
      }
    }

    if (nodeId === "add-to-sheet") {
      return (
        <GoogleSheetFields
          credentials={credentials}
          googleLoading={googleLoading}
          googleMessage={googleMessage}
          onPatch={patchCredentials}
          onConnectGoogle={handleConnectGoogle}
          onDisconnectGoogle={handleDisconnectGoogle}
          onSaveSpreadsheet={handleSaveSpreadsheet}
        />
      );
    }

    return null;
  }

  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-border bg-surface-elevated">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-heading">Cấu hình node</h2>
        <p className="mt-1 text-sm text-muted">
          {configuredCount}/{configurableNodes.length} bước đã cấu hình
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {configurableNodes.map((nodeId) => {
          const meta = CONFIGURABLE_NODE_META[nodeId];
          return (
            <NodeSectionShell
              key={nodeId}
              nodeId={nodeId}
              title={meta.title}
              description={meta.description}
              configured={isWorkflowStepConfigured(
                nodeId,
                config,
                requiresTopic,
              )}
              focused={focusedNodeId === nodeId}>
              {renderNodeFields(nodeId)}
            </NodeSectionShell>
          );
        })}

        {saveResult && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              saveResult.ok
                ? "border-[var(--node-green-border)] bg-[var(--node-green-bg)] text-[var(--node-green)]"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}>
            {saveResult.message}
          </div>
        )}

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

      <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-4">
        {/* <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-elevated">
          Close
        </button> */}
        {/* <div className="flex items-center gap-2"> */}
          <button
            type="button"
            disabled={saving || !appWorkflowId}
            onClick={handleSaveConfig}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu cấu hình
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
        {/* </div> */}
      </div>
    </aside>
  );
}
