"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Redo2, Share2, Sparkles, Undo2 } from "lucide-react";
import {
  CredentialsConfigPanel,
  NodeIcon,
} from "@/components/automations/credentials-config-panel";
import { WebhookConfigPanel } from "@/components/automations/webhook-config-panel";
import { WorkflowCanvasViewport } from "@/components/automations/workflow-canvas-viewport";
import { WorkflowStatusBadge } from "@/components/automations/workflow-status-badge";
import {
  DEFAULT_WORKFLOW_CONFIG,
  type WorkflowNodeConfig,
  type WorkflowType,
} from "@/lib/automations/data";
import { useWorkflowPolling } from "@/lib/automations/use-workflow-polling";
import { useWorkflow } from "@/lib/automations/use-workflow-store";
import {
  WORKFLOW_TEMPLATES,
  type CanvasNode,
  type ConfigurableNodeId,
} from "@/lib/automations/workflow-templates";
import { updateWorkflowConfig } from "@/lib/automations/workflow-store";
import {
  NODE_TONE_STYLES,
  ZONE_TONE_STYLES,
  resolveNodeTone,
  type NodeTone,
} from "@/lib/automations/node-tones";

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
  requiresTopic: boolean,
): boolean {
  if (nodeId === "webhook") {
    return requiresTopic ? Boolean(config.topic.trim()) : true;
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
  const workflow = useWorkflow(workflowId);
  useWorkflowPolling(workflowId);
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
    isNodeConfigured(nodeId, config, template.requiresTopic),
  ).length;

  function handleConfigChange(next: WorkflowNodeConfig) {
    setConfig(next);
    updateWorkflowConfig(workflowId, next);
  }

  const zoneToneMap: Record<"blue" | "green" | "orange", NodeTone> = {
    blue: "blue",
    green: "green",
    orange: "orange",
  };

  function getNodeClasses(
    node: (typeof template.nodes)[number],
    isSelected: boolean,
    isConfigured: boolean,
  ) {
    const tone = resolveNodeTone(node);
    const styles = NODE_TONE_STYLES[tone];

    return {
      tone,
      styles,
      card: `${styles.card} ${
        isSelected ? "ring-2 ring-[var(--node-green)]/30" : ""
      }`,
      icon: isConfigured ? styles.icon : styles.icon,
      ready: styles.ready,
    };
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/automations"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-heading">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-heading">
                {workflowName}
              </h1>
              {workflow && <WorkflowStatusBadge status={workflow.status} />}
            </div>
            <p className="text-xs text-muted">
              {workflowTypeLabel} · n8n workflow · {configuredCount}/
              {template.configurableNodes.length} nodes configured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              id="testing-mode-label"
              className="text-sm text-muted">
              Testing mode
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={testingMode}
              aria-labelledby="testing-mode-label"
              onClick={() => setTestingMode(!testingMode)}
              className={`relative h-6 w-11 rounded-full transition ${
                testingMode ? "bg-secondary" : "bg-border"
              }`}>
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface-elevated shadow transition ${
                  testingMode ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            aria-label="Share workflow"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted">
            <Share2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 p-[1.5px]">
            <span className="inline-flex h-[34px] items-center gap-2 rounded-[10px] bg-surface-elevated px-3 text-sm font-medium text-heading">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Try AI
            </span>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <WorkflowCanvasViewport
          canvasWidth={template.canvasWidth}
          canvasHeight={template.canvasHeight}
          toolbar={
            <div className="absolute left-6 top-6 z-10 flex gap-2">
              <button
                type="button"
                aria-label="Undo"
                disabled
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-elevated text-muted">
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Redo"
                disabled
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-elevated text-muted">
                <Redo2 className="h-4 w-4" />
              </button>
            </div>
          }>
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-border"
            viewBox={`0 0 ${template.canvasWidth} ${template.canvasHeight}`}
            aria-hidden="true">
            {connectionPaths.map(({ id, d }) => (
              <path
                key={id}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            ))}
          </svg>

          {template.nodes.map((node) => {
            if (node.variant === "zone") {
              const zoneTone = zoneToneMap[node.zoneColor ?? "blue"];
              return (
                <div
                  key={node.id}
                  className={`pointer-events-none absolute rounded-2xl border ${
                    ZONE_TONE_STYLES[zoneTone]
                  }`}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.width,
                    height: node.height,
                  }}>
                  <p
                    className={`px-3 py-2 text-xs font-semibold ${NODE_TONE_STYLES[zoneTone].label}`}>
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
              isNodeConfigured(
                node.configurableId,
                config,
                template.requiresTopic,
              );
            const nodeStyle = getNodeClasses(
              node,
              Boolean(isSelected),
              Boolean(isConfigured),
            );

            const baseClasses =
              "absolute select-none rounded-lg border transition";

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
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${nodeStyle.icon}`}>
                      <NodeIcon icon={node.icon} />
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`truncate text-xs font-medium ${nodeStyle.styles.label}`}>
                        {node.label}
                      </p>
                      {node.subtitle && (
                        <p className="text-[10px] text-muted">
                          {node.subtitle}
                        </p>
                      )}
                    </div>
                    {isConfigured && (
                      <span
                        className={`ml-auto text-[10px] ${nodeStyle.ready}`}>
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
                    data-canvas-node="true"
                    data-node-tone={nodeStyle.tone}
                    onClick={() =>
                      node.configurableId &&
                      setSelectedNodeId(node.configurableId)
                    }
                    className={`${baseClasses} ${nodeStyle.card} text-left hover:brightness-[0.98]`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                    }}>
                    {content}
                  </button>
                );
              }

              return (
                <div
                  key={node.id}
                  data-canvas-node="true"
                  data-node-tone={nodeStyle.tone}
                  className={`${baseClasses} ${nodeStyle.card}`}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.width,
                    height: node.height,
                  }}>
                  {content}
                </div>
              );
            }

            const Wrapper = isConfigurable ? "button" : "div";

            return (
              <Wrapper
                key={node.id}
                data-canvas-node={isConfigurable ? "true" : undefined}
                data-node-tone={nodeStyle.tone}
                type={isConfigurable ? "button" : undefined}
                onClick={
                  isConfigurable
                    ? () =>
                        node.configurableId &&
                        setSelectedNodeId(node.configurableId)
                    : undefined
                }
                className={`${baseClasses} ${nodeStyle.card} flex items-center gap-2 px-3 text-left ${
                  isConfigurable ? "hover:brightness-[0.98]" : ""
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                  cursor: isConfigurable ? "pointer" : "default",
                }}>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${nodeStyle.icon}`}>
                  <NodeIcon icon={node.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-xs font-medium ${nodeStyle.styles.label}`}>
                    {node.label}
                  </p>
                  {node.subtitle && (
                    <p className="text-[10px] text-muted">
                      {node.subtitle}
                    </p>
                  )}
                </div>
                {isConfigured && (
                  <span className={`text-[10px] ${nodeStyle.ready}`}>
                    Ready
                  </span>
                )}
              </Wrapper>
            );
          })}
        </WorkflowCanvasViewport>

        {selectedNodeId === "webhook" && (
          <WebhookConfigPanel
            appWorkflowId={workflowId}
            config={config}
            requiresTopic={template.requiresTopic}
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
