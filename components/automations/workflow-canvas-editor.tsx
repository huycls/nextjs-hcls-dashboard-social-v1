"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Redo2, Share2, Sparkles, Undo2 } from "lucide-react";
import {
  CredentialsConfigPanel,
  NodeIcon,
} from "@/components/automations/credentials-config-panel";
import { WebhookConfigPanel } from "@/components/automations/webhook-config-panel";
import { WorkflowBeamDiagram } from "@/components/automations/workflow-beam-diagram";
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
  type ConfigurableNodeId,
} from "@/lib/automations/workflow-templates";
import { updateWorkflowConfig } from "@/lib/automations/workflow-store";

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

  const configuredCount = template.configurableNodes.filter((nodeId) =>
    isNodeConfigured(nodeId, config, template.requiresTopic),
  ).length;

  function handleConfigChange(next: WorkflowNodeConfig) {
    setConfig(next);
    updateWorkflowConfig(workflowId, next);
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
          canvasWidth={720}
          canvasHeight={360}
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
          <div className="flex h-full flex-col items-center justify-center gap-8 px-6 py-8">
            <WorkflowBeamDiagram
              apps={workflow?.apps}
              size="lg"
              className="max-w-2xl"
            />

            <div className="flex flex-wrap items-center justify-center gap-2">
              {template.configurableNodes.map((nodeId) => {
                const node = template.nodes.find(
                  (item) => item.configurableId === nodeId,
                );
                const isSelected = selectedNodeId === nodeId;
                const isConfigured = isNodeConfigured(
                  nodeId,
                  config,
                  template.requiresTopic,
                );

                return (
                  <button
                    key={nodeId}
                    type="button"
                    onClick={() => setSelectedNodeId(nodeId)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${
                      isSelected
                        ? "border-primary/40 bg-primary/10 text-heading"
                        : "border-border bg-surface-elevated text-foreground hover:bg-surface"
                    }`}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface">
                      <NodeIcon icon={node?.icon} />
                    </span>
                    <span className="max-w-[140px] truncate font-medium">
                      {node?.label ?? nodeId}
                    </span>
                    {isConfigured && (
                      <span className="text-[10px] font-medium text-primary">
                        Ready
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
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
