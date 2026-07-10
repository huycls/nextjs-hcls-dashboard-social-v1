"use client";

import { X } from "lucide-react";
import type { WorkflowNodeConfig } from "@/lib/automations/data";
import { isWorkflowStepConfigured } from "@/lib/automations/workflow-config";
import {
  CONFIGURABLE_NODE_META,
  getCanvasNodeSize,
  type CanvasNode,
  type ConfigurableNodeId,
} from "@/lib/automations/workflow-templates";
import { DEFAULT_WORKFLOW_ID } from "@/lib/automations/jobs-server";

type WorkflowNodeConfigPopoverProps = {
  node: CanvasNode;
  config: WorkflowNodeConfig;
  requiresTopic: boolean;
  onChange: (config: WorkflowNodeConfig) => void;
  onClose: () => void;
};

type CredentialNodeId = Exclude<ConfigurableNodeId, "webhook">;

export function WorkflowNodeConfigPopover({
  node,
  config,
  requiresTopic,
  onChange,
  onClose,
}: WorkflowNodeConfigPopoverProps) {
  const configurableId = node.configurableId;
  if (!configurableId) return null;

  const meta = CONFIGURABLE_NODE_META[configurableId];
  const size = getCanvasNodeSize(node);
  const isComplete = isWorkflowStepConfigured(
    configurableId,
    config,
    requiresTopic,
  );

  const left = node.x + size.width + 16;
  const top = Math.max(24, node.y - 12);

  function updateCredentials(
    nodeId: CredentialNodeId,
    patch: { apiKey?: string; secretKey?: string },
  ) {
    const values = config.credentials[nodeId] ?? {
      apiKey: "",
      secretKey: "",
    };
    onChange({
      ...config,
      credentials: {
        ...config.credentials,
        [nodeId]: { ...values, ...patch },
      },
    });
  }

  return (
    <div
      data-canvas-node="true"
      className="absolute z-30 w-[300px] rounded-2xl border border-border bg-surface-elevated p-4 shadow-[0_20px_50px_rgba(15,23,42,0.16)]"
      style={{ left, top }}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-heading">{meta.title}</h3>
          <p className="mt-1 text-xs text-muted">{meta.description}</p>
        </div>
        <button
          type="button"
          aria-label="Close node settings"
          onClick={onClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-heading">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {configurableId === "webhook" ? (
          <>
            <Field
              id="popover-workflow-id"
              label="Workflow ID"
              value={config.workflowId ?? ""}
              placeholder={DEFAULT_WORKFLOW_ID}
              onChange={(value) => onChange({ ...config, workflowId: value })}
            />
            {requiresTopic && (
              <Field
                id="popover-topic"
                label="Topic"
                value={config.topic}
                placeholder="AI marketing trends 2026"
                onChange={(value) => onChange({ ...config, topic: value })}
              />
            )}
          </>
        ) : (
          <>
            <Field
              id={`${configurableId}-api-key`}
              label="API Key"
              value={config.credentials[configurableId]?.apiKey ?? ""}
              placeholder="Enter API key"
              onChange={(value) =>
                updateCredentials(configurableId, { apiKey: value })
              }
            />
            <Field
              id={`${configurableId}-secret-key`}
              label="Secret Key"
              type="password"
              value={config.credentials[configurableId]?.secretKey ?? ""}
              placeholder="Enter secret key"
              onChange={(value) =>
                updateCredentials(configurableId, { secretKey: value })
              }
            />
          </>
        )}
      </div>

      <p
        className={`mt-3 text-xs ${
          isComplete ? "text-[var(--node-green)]" : "text-amber-500"
        }`}>
        {isComplete ? "Configured." : "Configuration required."}
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-heading">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
