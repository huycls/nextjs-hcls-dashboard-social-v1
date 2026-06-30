import type { WorkflowType } from "@/lib/automations/data";

export type NodeIconType =
  | "trigger"
  | "process"
  | "ai"
  | "integration"
  | "output"
  | "complete"
  | "review";

export type ConfigurableNodeId =
  | "webhook"
  | "gemini-model"
  | "openrouter-model"
  | "add-to-sheet";

export type CanvasLabelPosition = "right" | "below";

export type CanvasNodeStyle = "placeholder" | "active" | "accent";

export type CanvasNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: NodeIconType;
  labelPosition: CanvasLabelPosition;
  nodeStyle: CanvasNodeStyle;
  configurableId?: ConfigurableNodeId;
};

export type CanvasConnection = {
  from: string;
  to: string;
  dashed?: boolean;
};

export type WorkflowTemplate = {
  canvasWidth: number;
  canvasHeight: number;
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  configurableNodes: ConfigurableNodeId[];
  requiresTopic: boolean;
};

type WorkflowTypeConfig = {
  configurableNodes: ConfigurableNodeId[];
  requiresTopic: boolean;
};

const WORKFLOW_TYPE_CONFIG: Record<WorkflowType, WorkflowTypeConfig> = {
  "generate-idea-posts": {
    configurableNodes: [
      "webhook",
      "gemini-model",
      "openrouter-model",
      "add-to-sheet",
    ],
    requiresTopic: true,
  },
  "generate-content-post": {
    configurableNodes: ["webhook", "gemini-model", "add-to-sheet"],
    requiresTopic: false,
  },
};

const ICON_SIZE = 44;
const CANVAS_WIDTH = 520;
const SPINE_X = CANVAS_WIDTH / 2 - ICON_SIZE / 2;

type BranchStep = {
  id: string;
  label: string;
  icon: NodeIconType;
  configurableId: ConfigurableNodeId;
};

const BRANCH_STEPS: BranchStep[] = [
  {
    id: "ai-settings",
    label: "AI Settings",
    icon: "ai",
    configurableId: "gemini-model",
  },
  {
    id: "integration",
    label: "Integration",
    icon: "integration",
    configurableId: "openrouter-model",
  },
  {
    id: "output",
    label: "Output",
    icon: "output",
    configurableId: "add-to-sheet",
  },
];

function buildVerticalTemplate(type: WorkflowType): WorkflowTemplate {
  const { configurableNodes, requiresTopic } = WORKFLOW_TYPE_CONFIG[type];

  const visibleBranch = BRANCH_STEPS.filter((step) =>
    configurableNodes.includes(step.configurableId),
  );

  const nodes: CanvasNode[] = [
    {
      id: "trigger",
      label: "Trigger",
      x: SPINE_X,
      y: 40,
      icon: "trigger",
      labelPosition: "right",
      nodeStyle: "placeholder",
      configurableId: "webhook",
    },
    {
      id: "process",
      label: "Process",
      x: SPINE_X,
      y: 132,
      icon: "process",
      labelPosition: "right",
      nodeStyle: "accent",
    },
  ];

  const branchY = 248;
  const branchGap = 112;
  const branchTotalWidth =
    visibleBranch.length * ICON_SIZE + (visibleBranch.length - 1) * branchGap;
  const branchStartX = (CANVAS_WIDTH - branchTotalWidth) / 2;

  visibleBranch.forEach((step, index) => {
    nodes.push({
      id: step.id,
      label: step.label,
      x: branchStartX + index * (ICON_SIZE + branchGap),
      y: branchY,
      icon: step.icon,
      labelPosition: "below",
      nodeStyle: "placeholder",
      configurableId: step.configurableId,
    });
  });

  const footerY = 400;
  const footerGap = 120;
  const footerStartX =
    (CANVAS_WIDTH - (ICON_SIZE * 2 + footerGap)) / 2;

  nodes.push(
    {
      id: "complete",
      label: "Complete",
      x: footerStartX,
      y: footerY,
      icon: "complete",
      labelPosition: "below",
      nodeStyle: "active",
    },
    {
      id: "review",
      label: "Review",
      x: footerStartX + ICON_SIZE + footerGap,
      y: footerY,
      icon: "review",
      labelPosition: "below",
      nodeStyle: "active",
    },
  );

  const connections: CanvasConnection[] = [
    { from: "trigger", to: "process" },
  ];

  for (const step of visibleBranch) {
    connections.push({ from: "process", to: step.id });
  }

  const midBranch = visibleBranch[Math.floor(visibleBranch.length / 2)];
  if (midBranch) {
    connections.push({ from: midBranch.id, to: "complete" });
  }

  connections.push({ from: "complete", to: "review", dashed: true });

  return {
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: 520,
    nodes,
    connections,
    configurableNodes,
    requiresTopic,
  };
}

export const WORKFLOW_TEMPLATES: Record<WorkflowType, WorkflowTemplate> = {
  "generate-idea-posts": buildVerticalTemplate("generate-idea-posts"),
  "generate-content-post": buildVerticalTemplate("generate-content-post"),
};

export const CANVAS_ICON_SIZE = ICON_SIZE;

export const CONFIGURABLE_NODE_META: Record<
  ConfigurableNodeId,
  { title: string; description: string; kind: "webhook" | "credentials" }
> = {
  webhook: {
    title: "Trigger",
    description: "Configure when and how this workflow starts.",
    kind: "webhook",
  },
  "gemini-model": {
    title: "AI Settings",
    description: "Configure credentials for automated processing.",
    kind: "credentials",
  },
  "openrouter-model": {
    title: "Integration",
    description: "Configure external service connection.",
    kind: "credentials",
  },
  "add-to-sheet": {
    title: "Output",
    description: "Configure where results are delivered.",
    kind: "credentials",
  },
};
