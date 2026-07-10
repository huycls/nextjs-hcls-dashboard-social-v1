"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plug,
  Redo2,
  Settings,
  Share2,
  Undo2,
} from "lucide-react";
import { LinkAnotherAppPanel } from "@/components/templates/automations/link-another-app-panel";
import { WorkflowCanvasDiagram } from "@/components/templates/automations/workflow-canvas-diagram";
import { WorkflowCanvasViewport } from "@/components/templates/automations/workflow-canvas-viewport";
import { WorkflowEnvironmentBadge } from "@/components/templates/automations/workflow-environment-badge";
import { WorkflowNodeConfigPopover } from "@/components/templates/automations/workflow-node-config-popover";
import { WorkflowSettingsPanel } from "@/components/templates/automations/workflow-settings-panel";
import { WorkflowStatusBadge } from "@/components/templates/automations/workflow-status-badge";
import {
  DEFAULT_WORKFLOW_CONFIG,
  WORKFLOW_STATUS_LABELS,
  type WorkflowNodeConfig,
  type WorkflowType,
} from "@/lib/automations/data";
import { DEFAULT_WORKFLOW_ID } from "@/lib/automations/jobs-server";
import { isWorkflowStepConfigured } from "@/lib/automations/workflow-config";
import {
  getWorkflowRunEnvironment,
  shouldUseProductionWebhook,
} from "@/lib/automations/workflow-environment";
import { triggerWorkflowJob } from "@/lib/automations/trigger-job";
import { useWorkflowPolling } from "@/lib/automations/use-workflow-polling";
import {
  notifyWorkflowStoreUpdated,
  useWorkflow,
} from "@/lib/automations/use-workflow-store";
import { WORKFLOW_TEMPLATES } from "@/lib/automations/workflow-templates";
import {
  updateWorkflowConfig,
  updateWorkflowFromBackend,
} from "@/lib/automations/workflow-store";
import { cn } from "@/lib/utils/tailwind-merge";

type WorkflowCanvasEditorProps = {
  workflowId: string;
  workflowName: string;
  workflowType: WorkflowType;
  workflowTypeLabel: string;
  initialConfig?: WorkflowNodeConfig;
};

type RightPanel = "apps" | "settings" | null;

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

  const [rightPanel, setRightPanel] = useState<RightPanel>("apps");
  const [config, setConfig] = useState<WorkflowNodeConfig>(initialConfig);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);

  const runEnvironment = getWorkflowRunEnvironment(workflow?.status);
  const configuredCount = template.configurableNodes.filter((nodeId) =>
    isWorkflowStepConfigured(nodeId, config, template.requiresTopic),
  ).length;

  const selectedNode = useMemo(
    () => template.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId, template.nodes],
  );

  const jobWorkflowId =
    (config.workflowId ?? "").trim() || DEFAULT_WORKFLOW_ID;

  function handleConfigChange(next: WorkflowNodeConfig) {
    setConfig(next);
    updateWorkflowConfig(workflowId, next);
  }

  function togglePanel(panel: Exclude<RightPanel, null>) {
    setRightPanel((current) => (current === panel ? null : panel));
  }

  async function handlePlay() {
    const topic = config.topic.trim();
    if (!jobWorkflowId || (template.requiresTopic && !topic)) return;

    setTriggering(true);
    const useProductionWebhook = shouldUseProductionWebhook(workflow?.status);
    const result = await triggerWorkflowJob(
      jobWorkflowId,
      template.requiresTopic ? topic : undefined,
      { useProductionWebhook },
    );

    if (result.workflow) {
      updateWorkflowFromBackend(result.workflow);
      notifyWorkflowStoreUpdated();
    }
    setTriggering(false);
  }

  return (
    <div className="flex h-screen flex-col bg-surface">
      <div className="flex items-center gap-3 border-b border-border bg-surface-elevated px-4 py-2.5">
        <Link
          href="/dashboard/automations"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-heading"
          aria-label="Back to automations">
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          <div className="inline-flex max-w-[240px] items-center gap-2 rounded-t-xl border border-b-0 border-border bg-surface px-3 py-2 text-sm font-medium text-heading">
            <span className="truncate">{workflowName}</span>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <TabChip label={workflowTypeLabel} muted />
            <TabChip label="Welcome Email Drip" muted />
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <p className="text-xs text-muted">
            {workflow
              ? `${WORKFLOW_STATUS_LABELS[workflow.status]} · ${configuredCount}/${template.configurableNodes.length} configured`
              : "Last edited just now"}
          </p>
          {workflow && <WorkflowStatusBadge status={workflow.status} />}
          <WorkflowEnvironmentBadge environment={runEnvironment} />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Link another app"
            aria-pressed={rightPanel === "apps"}
            onClick={() => togglePanel("apps")}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition",
              rightPanel === "apps"
                ? "border-primary bg-primary/10 text-heading"
                : "border-border text-muted hover:bg-surface hover:text-foreground",
            )}>
            <Plug className="h-4 w-4" />
            <span className="hidden lg:inline">Apps</span>
          </button>

          <button
            type="button"
            aria-label="Workflow settings"
            aria-pressed={rightPanel === "settings"}
            onClick={() => togglePanel("settings")}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition",
              rightPanel === "settings"
                ? "border-primary bg-primary/10 text-heading"
                : "border-border text-muted hover:bg-surface hover:text-foreground",
            )}>
            <Settings className="h-4 w-4" />
            <span className="hidden lg:inline">Settings</span>
          </button>

          <button
            type="button"
            aria-label="Share workflow"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-teal-500 px-3.5 text-sm font-medium text-white transition hover:bg-teal-600">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <WorkflowCanvasViewport
          canvasWidth={template.canvasWidth}
          canvasHeight={template.canvasHeight}
          onBackgroundClick={() => setSelectedNodeId(null)}
          onPlay={handlePlay}
          playDisabled={
            triggering ||
            (template.requiresTopic && !config.topic.trim()) ||
            !jobWorkflowId
          }
          playLabel={
            runEnvironment === "production" ? "Run in production" : "Run test"
          }
          overlay={
            <div
              data-canvas-ui="true"
              className="absolute left-5 top-5 z-20 flex gap-2">
              <button
                type="button"
                aria-label="Undo"
                disabled
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-elevated/95 text-muted shadow-sm backdrop-blur-sm disabled:opacity-50">
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Redo"
                disabled
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-elevated/95 text-muted shadow-sm backdrop-blur-sm disabled:opacity-50">
                <Redo2 className="h-4 w-4" />
              </button>
              {triggering && (
                <span className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-surface-elevated/95 px-3 text-xs font-medium text-muted shadow-sm backdrop-blur-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Running…
                </span>
              )}
            </div>
          }>
          <WorkflowCanvasDiagram
            template={template}
            config={config}
            configuredCount={configuredCount}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />

          {selectedNode?.configurableId && (
            <WorkflowNodeConfigPopover
              node={selectedNode}
              config={config}
              requiresTopic={template.requiresTopic}
              onChange={handleConfigChange}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
        </WorkflowCanvasViewport>

        {rightPanel === "apps" && (
          <LinkAnotherAppPanel onClose={() => setRightPanel(null)} />
        )}

        {rightPanel === "settings" && (
          <WorkflowSettingsPanel
            appWorkflowId={workflowId}
            config={config}
            configurableNodes={template.configurableNodes}
            requiresTopic={template.requiresTopic}
            onChange={handleConfigChange}
            onClose={() => setRightPanel(null)}
          />
        )}
      </div>
    </div>
  );
}

function TabChip({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-[180px] truncate rounded-xl px-3 py-2 text-sm",
        muted
          ? "text-muted hover:bg-surface"
          : "border border-border bg-surface text-heading",
      )}>
      {label}
    </span>
  );
}
