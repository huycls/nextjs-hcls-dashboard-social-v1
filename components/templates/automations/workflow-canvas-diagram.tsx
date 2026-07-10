"use client";

import { useMemo } from "react";
import { Check, CircleDashed } from "lucide-react";
import { WorkflowCanvasIcon } from "@/components/templates/automations/workflow-canvas-icon";
import { AnimatedBeam } from "@/registry/magicui/animated-beam";
import type { WorkflowNodeConfig } from "@/lib/automations/data";
import { isWorkflowStepConfigured } from "@/lib/automations/workflow-config";
import {
  buildConnectionPath,
  getConnectionLabelPoint,
  getStatusPillPosition,
} from "@/lib/automations/workflow-canvas-paths";
import {
  getCanvasNodeSize,
  type CanvasAppBrand,
  type CanvasNode,
  type WorkflowTemplate,
} from "@/lib/automations/workflow-templates";
import { cn } from "@/lib/utils/tailwind-merge";

type WorkflowCanvasDiagramProps = {
  template: WorkflowTemplate;
  config: WorkflowNodeConfig;
  configuredCount: number;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
};

const BRAND_STYLES: Record<
  CanvasAppBrand,
  { box: string; icon: string }
> = {
  start: {
    box: "bg-teal-500 text-white",
    icon: "text-white",
  },
  webhook: {
    box: "bg-rose-500 text-white",
    icon: "text-white",
  },
  ai: {
    box: "bg-violet-500 text-white",
    icon: "text-white",
  },
  router: {
    box: "bg-sky-500 text-white",
    icon: "text-white",
  },
  sheet: {
    box: "bg-emerald-500 text-white",
    icon: "text-white",
  },
  complete: {
    box: "bg-primary text-white",
    icon: "text-white",
  },
  review: {
    box: "bg-amber-500 text-white",
    icon: "text-white",
  },
  add: {
    box: "bg-transparent text-muted",
    icon: "text-muted",
  },
};

function CanvasNodeView({
  node,
  isConfigured,
  isSelected,
  onSelect,
}: {
  node: CanvasNode;
  isConfigured: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const size = getCanvasNodeSize(node);
  const brand = BRAND_STYLES[node.brand];

  if (node.nodeStyle === "placeholder") {
    return (
      <button
        type="button"
        data-canvas-node="true"
        onClick={onSelect}
        className={cn(
          "absolute flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/80 text-muted transition hover:border-primary/40 hover:text-heading",
          isSelected && "border-primary text-primary",
        )}
        style={{ left: node.x, top: node.y, width: size.width, height: size.height }}
        aria-label="Add trigger">
        <WorkflowCanvasIcon icon={node.icon} />
      </button>
    );
  }

  if (node.nodeStyle === "logic") {
    return (
      <button
        type="button"
        data-canvas-node="true"
        onClick={onSelect}
        className={cn(
          "absolute flex items-center justify-center rounded-full border border-border bg-surface-elevated text-xs font-semibold text-heading shadow-sm transition",
          isSelected && "ring-2 ring-primary/40",
        )}
        style={{ left: node.x, top: node.y, width: size.width, height: size.height }}
        aria-label={node.label}>
        {node.label}
      </button>
    );
  }

  if (node.nodeStyle === "start") {
    return (
      <button
        type="button"
        data-canvas-node="true"
        onClick={onSelect}
        className={cn(
          "absolute flex items-center gap-3 rounded-2xl border border-teal-500/30 bg-surface-elevated px-3.5 py-2.5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition",
          isSelected && "ring-2 ring-teal-500/30",
        )}
        style={{ left: node.x, top: node.y, width: size.width, height: size.height }}>
        <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl", brand.box)}>
          <WorkflowCanvasIcon icon={node.icon} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-heading">{node.label}</span>
          <span className="block truncate text-xs text-muted">{node.subtitle}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      data-canvas-node="true"
      onClick={onSelect}
      className={cn(
        "absolute flex items-center gap-3 rounded-2xl border bg-surface-elevated px-3.5 py-2.5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition",
        isConfigured
          ? "border-border"
          : "border-dashed border-border",
        isSelected && "border-orange-400 border-dashed ring-2 ring-orange-400/20",
        node.nodeStyle === "accent" && !isSelected && "border-[var(--node-blue-border)]",
      )}
      style={{ left: node.x, top: node.y, width: size.width, height: size.height }}>
      <span
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          brand.box,
        )}>
        <WorkflowCanvasIcon icon={node.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="block truncate text-sm font-semibold text-heading">
            {node.label}
          </span>
          {node.configurableId &&
            (isConfigured ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-[var(--node-green)]" />
            ) : (
              <CircleDashed className="h-3.5 w-3.5 shrink-0 text-muted" />
            ))}
        </span>
        <span className="block truncate text-xs text-muted">{node.subtitle}</span>
      </span>
    </button>
  );
}

export function WorkflowCanvasDiagram({
  template,
  config,
  configuredCount,
  selectedNodeId,
  onSelectNode,
}: WorkflowCanvasDiagramProps) {
  const connectionPaths = useMemo(
    () =>
      template.connections.map((connection) => {
        const labelPoint = getConnectionLabelPoint(template.nodes, connection);
        return {
          id: `${connection.from}-${connection.to}`,
          d: buildConnectionPath(template.nodes, connection),
          dashed: connection.dashed,
          tone: connection.tone ?? "default",
          label: connection.label,
          labelPoint,
        };
      }),
    [template],
  );

  const statusPill = getStatusPillPosition(template.nodes);
  const allConfigured = configuredCount === template.configurableNodes.length;

  return (
    <>
      {connectionPaths.map(({ id, d, dashed, tone, label, labelPoint }, index) => (
        <div key={id}>
          <AnimatedBeam
            pathD={d}
            viewBoxWidth={template.canvasWidth}
            viewBoxHeight={template.canvasHeight}
            dashed={dashed}
            duration={3.2}
            delay={index * 0.14}
            pathOpacity={0.95}
            pathColor={
              tone === "true"
                ? "#14b8a6"
                : tone === "false"
                  ? "#f472b6"
                  : "var(--border)"
            }
            gradientStartColor={
              tone === "true"
                ? "#14b8a6"
                : tone === "false"
                  ? "#f472b6"
                  : "var(--primary)"
            }
            gradientStopColor={
              tone === "true"
                ? "#5eead4"
                : tone === "false"
                  ? "#fbcfe8"
                  : "var(--node-blue-border)"
            }
          />
          {label && labelPoint && (
            <span
              className={cn(
                "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                tone === "true" && "bg-teal-500/10 text-teal-600",
                tone === "false" && "bg-pink-500/10 text-pink-500",
              )}
              style={{ left: labelPoint.x, top: labelPoint.y }}
              data-canvas-node="true">
              {label}
            </span>
          )}
        </div>
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
            isSelected={selectedNodeId === node.id}
            onSelect={() =>
              onSelectNode(selectedNodeId === node.id ? null : node.id)
            }
          />
        );
      })}

      <div
        className={cn(
          "absolute flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm",
          allConfigured
            ? "bg-[var(--node-green)] text-white"
            : "border border-border bg-surface-elevated/95 text-foreground backdrop-blur-sm",
        )}
        style={{
          left: statusPill.x,
          top: statusPill.y,
          width: statusPill.width,
        }}
        data-canvas-node="true">
        {allConfigured ? (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        ) : (
          <span className="relative inline-flex h-4 w-4 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-border" />
            <span
              className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
              style={{
                transform: `rotate(${(configuredCount / Math.max(template.configurableNodes.length, 1)) * 360}deg)`,
              }}
            />
          </span>
        )}
        <span>
          {configuredCount} of {template.configurableNodes.length} tasks done
        </span>
      </div>
    </>
  );
}
