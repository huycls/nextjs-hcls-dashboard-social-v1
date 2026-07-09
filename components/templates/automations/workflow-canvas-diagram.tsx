"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { WorkflowCanvasIcon } from "@/components/templates/automations/workflow-canvas-icon";
import { AnimatedBeam } from "@/registry/magicui/animated-beam";
import type { WorkflowNodeConfig } from "@/lib/automations/data";
import { isWorkflowStepConfigured } from "@/lib/automations/workflow-config";
import {
  buildConnectionPath,
  getStatusPillPosition,
} from "@/lib/automations/workflow-canvas-paths";
import {
  CANVAS_ICON_SIZE,
  type CanvasNode,
  type WorkflowTemplate,
} from "@/lib/automations/workflow-templates";

type WorkflowCanvasDiagramProps = {
  template: WorkflowTemplate;
  config: WorkflowNodeConfig;
  configuredCount: number;
};

function resolveNodeBorder(node: CanvasNode, isConfigured: boolean): string {
  if (node.nodeStyle === "accent") {
    return "border-dashed border-[var(--node-blue-border)] bg-[var(--node-blue-bg)]/40";
  }

  if (node.configurableId) {
    return isConfigured
      ? "border-primary bg-surface text-primary"
      : "border-dashed border-border bg-surface text-muted";
  }

  return "border-primary bg-surface text-primary";
}

function CanvasNodeView({
  node,
  isConfigured,
}: {
  node: CanvasNode;
  isConfigured: boolean;
}) {
  const borderClass = resolveNodeBorder(node, isConfigured);
  const iconBox = (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border ${isConfigured ? "text-muted" : "text-primary border-primary"} ${borderClass}`}>
      <WorkflowCanvasIcon icon={node.icon} />
    </div>
  );

  if (node.labelPosition === "right") {
    return (
      <div
        className="absolute flex items-center gap-3"
        style={{ left: node.x, top: node.y }}
        data-canvas-node="true">
        {iconBox}
        <span className="text-sm font-medium text-heading">{node.label}</span>
      </div>
    );
  }

  return (
    <div
      className="absolute flex flex-col items-center gap-2"
      style={{ left: node.x, top: node.y, width: CANVAS_ICON_SIZE }}
      data-canvas-node="true">
      {iconBox}
      <span className="max-w-[88px] text-center text-xs font-medium text-foreground">
        {node.label}
      </span>
    </div>
  );
}

export function WorkflowCanvasDiagram({
  template,
  config,
  configuredCount,
}: WorkflowCanvasDiagramProps) {
  const connectionPaths = useMemo(
    () =>
      template.connections.map((connection) => ({
        id: `${connection.from}-${connection.to}`,
        d: buildConnectionPath(template.nodes, connection),
        dashed: connection.dashed,
      })),
    [template],
  );

  const statusPill = getStatusPillPosition(template.nodes);
  const allConfigured = configuredCount === template.configurableNodes.length;

  return (
    <>
      {connectionPaths.map(({ id, d, dashed }, index) => (
        <AnimatedBeam
          key={id}
          pathD={d}
          viewBoxWidth={template.canvasWidth}
          viewBoxHeight={template.canvasHeight}
          dashed={dashed}
          duration={3}
          delay={index * 0.18}
          pathOpacity={0.9}
        />
      ))}

      {template.nodes.map((node) => {
        const isConfigured = node.configurableId
          ? isWorkflowStepConfigured(
              node.configurableId,
              config,
              template.requiresTopic,
            )
          : false;

        return (
          <CanvasNodeView
            key={node.id}
            node={node}
            isConfigured={isConfigured}
          />
        );
      })}

      <div
        className={`absolute flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium shadow-sm ${
          allConfigured
            ? "bg-[var(--node-green)] text-white"
            : "border border-border bg-surface-elevated text-foreground"
        }`}
        style={{
          left: statusPill.x,
          top: statusPill.y + 100,
          width: statusPill.width,
        }}
        data-canvas-node="true">
        {allConfigured && (
          <Check
            className="h-4 w-4"
            strokeWidth={2.5}
          />
        )}
        <span>
          {configuredCount}/{template.configurableNodes.length} steps configured
        </span>
      </div>
    </>
  );
}
