import type { CanvasNode } from "@/lib/automations/workflow-templates";

export type NodeTone = "green" | "orange" | "blue";

export const NODE_TONE_STYLES: Record<
  NodeTone,
  { card: string; icon: string; label: string; ready: string }
> = {
  green: {
    card: "border-[var(--node-green-border)] bg-[var(--node-green-bg)]",
    icon: "bg-[var(--node-green-bg)] text-[var(--node-green)]",
    label: "text-[var(--node-green)]",
    ready: "text-[var(--node-green)]",
  },
  orange: {
    card: "border-[var(--node-orange-border)] bg-[var(--node-orange-bg)]",
    icon: "bg-[var(--node-orange-bg)] text-[var(--node-orange)]",
    label: "text-[var(--node-orange)]",
    ready: "text-[var(--node-orange)]",
  },
  blue: {
    card: "border-[var(--node-blue-border)] bg-[var(--node-blue-bg)]",
    icon: "bg-[var(--node-blue-bg)] text-[var(--node-blue)]",
    label: "text-[var(--node-blue)]",
    ready: "text-[var(--node-blue)]",
  },
};

export const ZONE_TONE_STYLES: Record<NodeTone, string> = {
  green: "border-[var(--node-green-border)]/60 bg-[var(--node-green-bg)]/50",
  orange: "border-[var(--node-orange-border)]/60 bg-[var(--node-orange-bg)]/50",
  blue: "border-[var(--node-blue-border)]/60 bg-[var(--node-blue-bg)]/50",
};

export function resolveNodeTone(node: CanvasNode): NodeTone {
  if (node.tone) return node.tone;

  if (node.variant === "webhook" || node.variant === "form") return "orange";
  if (
    node.variant === "condition" ||
    node.icon === "code" ||
    node.icon === "split"
  ) {
    return "orange";
  }
  if (
    node.variant === "ai-agent" ||
    node.icon === "gemini" ||
    node.icon === "openrouter" ||
    node.icon === "sheets" ||
    node.icon === "sparkles"
  ) {
    return "blue";
  }

  return "green";
}
