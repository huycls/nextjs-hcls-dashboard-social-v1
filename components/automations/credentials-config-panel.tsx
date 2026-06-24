"use client";

import { ArrowRight } from "lucide-react";
import {
  CONFIGURABLE_NODE_META,
  type ConfigurableNodeId,
} from "@/lib/automations/workflow-templates";
import type { WorkflowNodeConfig } from "@/lib/automations/data";

type CredentialsConfigPanelProps = {
  nodeId: Exclude<ConfigurableNodeId, "webhook">;
  config: WorkflowNodeConfig;
  onChange: (config: WorkflowNodeConfig) => void;
  onClose: () => void;
};

export function CredentialsConfigPanel({
  nodeId,
  config,
  onChange,
  onClose,
}: CredentialsConfigPanelProps) {
  const node = CONFIGURABLE_NODE_META[nodeId];
  const values = config.credentials[nodeId] ?? { apiKey: "", secretKey: "" };

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
    <aside className="flex w-[380px] shrink-0 flex-col border-l border-border bg-surface">
      <div className="border-b border-border px-5 py-4">
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-heading">Parameters</span>
          <span className="text-[#333333]d">Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h2 className="text-lg font-semibold text-heading">{node.title}</h2>
        <p className="mt-1 text-sm text-[#333333]d">{node.description}</p>

        <div className="mt-6 space-y-4">
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
              className="h-11 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
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
              className="h-11 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {!values.apiKey || !values.secretKey ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              Credentials required for this node.
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--node-green-border)] bg-[var(--node-green-bg)] px-4 py-3 text-sm text-[var(--node-green)]">
              Credentials saved for this node.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10">
          Close
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background transition hover:bg-primary-hover">
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

export function NodeIcon({ icon }: { icon?: string }) {
  switch (icon) {
    case "webhook":
      return <span className="text-base">⚡</span>;
    case "sparkles":
      return <span className="text-base">✨</span>;
    case "gemini":
      return <span className="text-[10px] font-bold text-secondary">G</span>;
    case "openrouter":
      return <span className="text-[10px] font-bold text-violet-400">OR</span>;
    case "code":
      return <span className="text-base">{`{}`}</span>;
    case "split":
      return <span className="text-base">⑂</span>;
    case "sheets":
      return <span className="text-[10px] font-bold text-emerald-400">GS</span>;
    case "form":
      return <span className="text-base">📋</span>;
    case "condition":
      return <span className="text-base">◇</span>;
    default:
      return null;
  }
}
