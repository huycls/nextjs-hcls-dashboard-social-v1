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
    <aside className="flex w-[380px] shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-gray-900">Parameters</span>
          <span className="text-gray-400">Settings</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <h2 className="text-lg font-semibold text-gray-900">{node.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{node.description}</p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor={`${nodeId}-api-key`}
              className="mb-2 block text-sm font-medium text-gray-900"
            >
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
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor={`${nodeId}-secret-key`}
              className="mb-2 block text-sm font-medium text-gray-900"
            >
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
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          {!values.apiKey || !values.secretKey ? (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Credentials required for this node.
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Credentials saved for this node.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          Close
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
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
      return <span className="text-[10px] font-bold text-blue-600">G</span>;
    case "openrouter":
      return <span className="text-[10px] font-bold text-violet-600">OR</span>;
    case "code":
      return <span className="text-base">{`{}`}</span>;
    case "split":
      return <span className="text-base">⑂</span>;
    case "sheets":
      return <span className="text-[10px] font-bold text-emerald-600">GS</span>;
    case "form":
      return <span className="text-base">📋</span>;
    case "condition":
      return <span className="text-base">◇</span>;
    default:
      return null;
  }
}
