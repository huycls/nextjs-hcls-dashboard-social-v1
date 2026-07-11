"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Redo2,
  Settings,
  Share2,
  Sparkles,
  Undo2,
} from "lucide-react";
import { WorkflowCanvasDiagram } from "@/components/templates/automations/workflow-canvas-diagram";
import { WorkflowCanvasViewport } from "@/components/templates/automations/workflow-canvas-viewport";
import { WorkflowEnvironmentBadge } from "@/components/templates/automations/workflow-environment-badge";
import { WorkflowSettingsPanel } from "@/components/templates/automations/workflow-settings-panel";
import { WorkflowStatusBadge } from "@/components/templates/automations/workflow-status-badge";
import {
  DEFAULT_WORKFLOW_CONFIG,
  normalizeWorkflowCredentials,
  type WorkflowNodeConfig,
  type WorkflowType,
} from "@/lib/automations/data";
import { isWorkflowStepConfigured } from "@/lib/automations/workflow-config";
import { getWorkflowRunEnvironment } from "@/lib/automations/workflow-environment";
import { useWorkflowPolling } from "@/lib/automations/use-workflow-polling";
import { useWorkflow } from "@/lib/automations/use-workflow-store";
import { WORKFLOW_TEMPLATES } from "@/lib/automations/workflow-templates";
import { updateWorkflowConfig } from "@/lib/automations/workflow-store";

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
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [config, setConfig] = useState<WorkflowNodeConfig>(() => ({
    ...DEFAULT_WORKFLOW_CONFIG,
    ...initialConfig,
    credentials: normalizeWorkflowCredentials(initialConfig.credentials),
  }));
  const runEnvironment = getWorkflowRunEnvironment(workflow?.status);

  const configuredCount = template.configurableNodes.filter((nodeId) =>
    isWorkflowStepConfigured(nodeId, config, template.requiresTopic),
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
              <WorkflowEnvironmentBadge environment={runEnvironment} />
            </div>
            <p className="text-xs text-muted">
              {workflowTypeLabel} · {configuredCount}/
              {template.configurableNodes.length} steps configured ·{" "}
              {runEnvironment === "test" ? "Test webhook" : "Production webhook"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Workflow settings"
            aria-pressed={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
            className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition ${
              settingsOpen
                ? "border-primary bg-primary/10 text-heading"
                : "border-border text-muted hover:bg-surface hover:text-foreground"
            }`}>
            <Settings className="h-4 w-4" />
            Settings
          </button>

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
          <WorkflowCanvasDiagram
            template={template}
            config={config}
            configuredCount={configuredCount}
          />
        </WorkflowCanvasViewport>

        {settingsOpen && (
          <WorkflowSettingsPanel
            appWorkflowId={workflowId}
            config={config}
            configurableNodes={template.configurableNodes}
            requiresTopic={template.requiresTopic}
            onChange={handleConfigChange}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
