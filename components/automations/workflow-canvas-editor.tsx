"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  Redo2,
  Share2,
  Sparkles,
  Undo2,
} from "lucide-react";
import { CredentialsConfigPanel, NodeIcon } from "@/components/automations/credentials-config-panel";
import { WebhookConfigPanel } from "@/components/automations/webhook-config-panel";
import {
  DEFAULT_WORKFLOW_CONFIG,
  type WorkflowNodeConfig,
  type WorkflowType,
} from "@/lib/automations/data";
import {
  WORKFLOW_TEMPLATES,
  type CanvasNode,
  type ConfigurableNodeId,
} from "@/lib/automations/workflow-templates";
import { updateWorkflowConfig } from "@/lib/automations/workflow-store";

function getNodeCenter(nodes: CanvasNode[], nodeId: string) {
  const node = nodes.find((item) => item.id === nodeId);
  if (!node) return { x: 0, y: 0 };

  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

function buildConnectionPath(
  nodes: CanvasNode[],
  fromId: string,
  toId: string,
) {
  const from = getNodeCenter(nodes, fromId);
  const to = getNodeCenter(nodes, toId);
  const midX = (from.x + to.x) / 2;

  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

function isNodeConfigured(
  nodeId: ConfigurableNodeId,
  config: WorkflowNodeConfig,
): boolean {
  if (nodeId === "webhook") {
    return Boolean(config.topic.trim());
  }

  const creds = config.credentials[nodeId];
  return Boolean(creds?.apiKey && creds?.secretKey);
}

type WorkflowCanvasEditorProps = {
  workflowId: string;
  workflowName: string;
  workflowType: WorkflowType;
  workflowTypeLabel: string;
  initialConfig?: WorkflowNodeConfig;
};

export function WorkflowCanvasEditor({
  workflowId,
  workflowName,
  workflowType,
  workflowTypeLabel,
  initialConfig = DEFAULT_WORKFLOW_CONFIG,
}: WorkflowCanvasEditorProps) {
  const template = WORKFLOW_TEMPLATES[workflowType];
  const [testingMode, setTestingMode] = useState(true);
  const [selectedNodeId, setSelectedNodeId] =
    useState<ConfigurableNodeId | null>("webhook");
  const [config, setConfig] = useState<WorkflowNodeConfig>(initialConfig);

  const connectionPaths = useMemo(
    () =>
      template.connections.map(([from, to]) => ({
        id: `${from}-${to}`,
        d: buildConnectionPath(template.nodes, from, to),
      })),
    [template],
  );

  const configuredCount = template.configurableNodes.filter((nodeId) =>
    isNodeConfigured(nodeId, config),
  ).length;

  function handleConfigChange(next: WorkflowNodeConfig) {
    setConfig(next);
    updateWorkflowConfig(workflowId, next);
  }

  const zoneColors = {
    blue: "bg-sky-50/80 border-sky-100",
    green: "bg-emerald-50/80 border-emerald-100",
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {workflowName}
            </h1>
            <p className="text-xs text-gray-500">
              {workflowTypeLabel} · n8n workflow · {configuredCount}/
              {template.configurableNodes.length} nodes configured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span id="testing-mode-label" className="text-sm text-gray-500">
              Testing mode
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={testingMode}
              aria-labelledby="testing-mode-label"
              onClick={() => setTestingMode(!testingMode)}
              className={`relative h-6 w-11 rounded-full transition ${
                testingMode ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  testingMode ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            aria-label="Share workflow"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 p-[1.5px]"
          >
            <span className="inline-flex h-[34px] items-center gap-2 rounded-[10px] bg-white px-3 text-sm font-medium text-gray-900">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Try AI
            </span>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 overflow-auto">
          <div className="absolute left-6 top-6 z-10 flex gap-2">
            <button
              type="button"
              aria-label="Undo"
              disabled
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Redo"
              disabled
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500">
            <button type="button" aria-label="Zoom out" disabled>
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span>100%</span>
            <button type="button" aria-label="Zoom in" disabled>
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div
            className="relative mx-auto min-h-full py-8"
            style={{
              width: template.canvasWidth,
              minHeight: template.canvasHeight,
              backgroundImage:
                "radial-gradient(circle, #E5E7EB 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${template.canvasWidth} ${template.canvasHeight}`}
              aria-hidden="true"
            >
              {connectionPaths.map(({ id, d }) => (
                <path
                  key={id}
                  d={d}
                  fill="none"
                  stroke="#C4C9D1"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {template.nodes.map((node) => {
              if (node.variant === "zone") {
                return (
                  <div
                    key={node.id}
                    className={`pointer-events-none absolute rounded-2xl border ${
                      zoneColors[node.zoneColor ?? "blue"]
                    }`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                    }}
                  >
                    <p className="px-3 py-2 text-xs font-semibold text-gray-600">
                      {node.label}
                    </p>
                  </div>
                );
              }

              const isConfigurable = Boolean(node.configurableId);
              const isSelected =
                node.configurableId && selectedNodeId === node.configurableId;
              const isConfigured =
                node.configurableId &&
                isNodeConfigured(node.configurableId, config);

              const baseClasses =
                "absolute select-none rounded-xl border bg-white shadow-sm transition";

              if (
                node.variant === "ai-agent" ||
                node.variant === "sub-node" ||
                node.variant === "form" ||
                node.variant === "condition"
              ) {
                const isClickable =
                  node.configurableId && node.variant === "sub-node";

                const content = (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isConfigured
                            ? "bg-emerald-50"
                            : node.variant === "ai-agent"
                              ? "bg-violet-50"
                              : "bg-gray-50"
                        }`}
                      >
                        <NodeIcon icon={node.icon} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-gray-900">
                          {node.label}
                        </p>
                        {node.subtitle && (
                          <p className="text-[10px] text-gray-400">
                            {node.subtitle}
                          </p>
                        )}
                      </div>
                      {isConfigured && (
                        <span className="ml-auto text-[10px] text-emerald-600">
                          Ready
                        </span>
                      )}
                    </div>
                  </>
                );

                if (isClickable) {
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() =>
                        node.configurableId &&
                        setSelectedNodeId(node.configurableId)
                      }
                      className={`${baseClasses} text-left ${
                        isSelected
                          ? "border-gray-900 ring-2 ring-gray-900/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{
                        left: node.x,
                        top: node.y,
                        width: node.width,
                        height: node.height,
                      }}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <div
                    key={node.id}
                    className={`${baseClasses} border-gray-200`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                    }}
                  >
                    {content}
                  </div>
                );
              }

              const Wrapper = isConfigurable ? "button" : "div";

              return (
                <Wrapper
                  key={node.id}
                  type={isConfigurable ? "button" : undefined}
                  onClick={
                    isConfigurable
                      ? () =>
                          node.configurableId &&
                          setSelectedNodeId(node.configurableId)
                      : undefined
                  }
                  className={`${baseClasses} flex items-center gap-2 px-3 text-left ${
                    isSelected
                      ? "border-gray-900 ring-2 ring-gray-900/10"
                      : "border-gray-200"
                  } ${isConfigurable ? "hover:border-gray-300" : ""}`}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.width,
                    height: node.height,
                    cursor: isConfigurable ? "pointer" : "default",
                  }}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isConfigured
                        ? "bg-emerald-50"
                        : node.variant === "webhook"
                          ? "bg-orange-50"
                          : "bg-gray-50"
                    }`}
                  >
                    <NodeIcon icon={node.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-900">
                      {node.label}
                    </p>
                    {node.subtitle && (
                      <p className="text-[10px] text-gray-400">
                        {node.subtitle}
                      </p>
                    )}
                  </div>
                  {isConfigured && (
                    <span className="text-[10px] text-emerald-600">Ready</span>
                  )}
                </Wrapper>
              );
            })}
          </div>
        </div>

        {selectedNodeId === "webhook" && (
          <WebhookConfigPanel
            workflowId={workflowId}
            config={config}
            onChange={handleConfigChange}
            onClose={() => setSelectedNodeId(null)}
          />
        )}

        {selectedNodeId &&
          selectedNodeId !== "webhook" &&
          (selectedNodeId === "gemini-model" ||
            selectedNodeId === "openrouter-model" ||
            selectedNodeId === "add-to-sheet") && (
            <CredentialsConfigPanel
              nodeId={selectedNodeId}
              config={config}
              onChange={handleConfigChange}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
      </div>
    </div>
  );
}
