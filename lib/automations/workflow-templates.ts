import type { WorkflowType } from "@/lib/automations/data";

export type NodeIconType =
  | "trigger"
  | "process"
  | "ai"
  | "integration"
  | "output"
  | "complete"
  | "review"
  | "start"
  | "add";

export type ConfigurableNodeId =
  | "webhook"
  | "gemini-model"
  | "openrouter-model"
  | "add-to-sheet";

export type CanvasNodeStyle =
  | "start"
  | "app"
  | "logic"
  | "placeholder"
  | "accent";

export type CanvasAppBrand =
  | "start"
  | "webhook"
  | "ai"
  | "router"
  | "sheet"
  | "complete"
  | "review"
  | "add";

export type CanvasNode = {
  id: string;
  label: string;
  subtitle: string;
  x: number;
  y: number;
  icon: NodeIconType;
  nodeStyle: CanvasNodeStyle;
  brand: CanvasAppBrand;
  configurableId?: ConfigurableNodeId;
  width?: number;
  height?: number;
};

export type CanvasConnection = {
  from: string;
  to: string;
  dashed?: boolean;
  tone?: "default" | "true" | "false";
  label?: string;
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

export const CANVAS_NODE_WIDTH = 180;
export const CANVAS_NODE_HEIGHT = 64;
export const CANVAS_START_WIDTH = 136;
export const CANVAS_LOGIC_SIZE = 44;
export const CANVAS_ADD_SIZE = 52;

/** @deprecated use CANVAS_NODE_WIDTH — kept for path helpers */
export const CANVAS_ICON_SIZE = CANVAS_NODE_HEIGHT;

const CANVAS_WIDTH = 1580;
const CANVAS_HEIGHT = 640;

function nodeSize(node: CanvasNode): { width: number; height: number } {
  if (node.width && node.height) {
    return { width: node.width, height: node.height };
  }
  if (node.nodeStyle === "start") {
    return { width: CANVAS_START_WIDTH, height: CANVAS_NODE_HEIGHT };
  }
  if (node.nodeStyle === "logic") {
    return { width: CANVAS_LOGIC_SIZE, height: CANVAS_LOGIC_SIZE };
  }
  if (node.nodeStyle === "placeholder") {
    return { width: CANVAS_ADD_SIZE, height: CANVAS_ADD_SIZE };
  }
  return { width: CANVAS_NODE_WIDTH, height: CANVAS_NODE_HEIGHT };
}

export function getCanvasNodeSize(node: CanvasNode) {
  return nodeSize(node);
}

function buildFlowTemplate(type: WorkflowType): WorkflowTemplate {
  const { configurableNodes, requiresTopic } = WORKFLOW_TYPE_CONFIG[type];
  const hasIntegration = configurableNodes.includes("openrouter-model");

  const spineY = 220;
  const startX = 40;
  const gap = 28;
  const cardW = CANVAS_NODE_WIDTH;
  const startW = CANVAS_START_WIDTH;

  const webhookX = startX + startW + gap;
  const processX = webhookX + cardW + gap;
  const aiX = processX + cardW + gap;

  const nodes: CanvasNode[] = [
    {
      id: "start",
      label: "Start",
      subtitle: "When clicking",
      x: startX,
      y: spineY,
      icon: "start",
      nodeStyle: "start",
      brand: "start",
    },
    {
      id: "trigger",
      label: "Webhook",
      subtitle: "get: trigger",
      x: webhookX,
      y: spineY,
      icon: "trigger",
      nodeStyle: "app",
      brand: "webhook",
      configurableId: "webhook",
    },
    {
      id: "process",
      label: "Process",
      subtitle: "prepare: payload",
      x: processX,
      y: spineY,
      icon: "process",
      nodeStyle: "accent",
      brand: "ai",
    },
    {
      id: "ai-settings",
      label: "AI Settings",
      subtitle: "gemini: model",
      x: aiX,
      y: spineY,
      icon: "ai",
      nodeStyle: "app",
      brand: "ai",
      configurableId: "gemini-model",
    },
  ];

  const connections: CanvasConnection[] = [
    { from: "start", to: "trigger" },
    { from: "trigger", to: "process" },
    { from: "process", to: "ai-settings" },
  ];

  let lastId = "ai-settings";
  let cursorX = aiX + cardW + gap;

  if (hasIntegration) {
    const logicX = cursorX;
    const logicY = spineY + (CANVAS_NODE_HEIGHT - CANVAS_LOGIC_SIZE) / 2;

    nodes.push({
      id: "branch",
      label: "If",
      subtitle: "",
      x: logicX,
      y: logicY,
      icon: "integration",
      nodeStyle: "logic",
      brand: "router",
      width: CANVAS_LOGIC_SIZE,
      height: CANVAS_LOGIC_SIZE,
    });

    connections.push({ from: "ai-settings", to: "branch" });

    const branchX = logicX + CANVAS_LOGIC_SIZE + gap;
    const trueY = spineY - 90;
    const falseY = spineY + 90;

    nodes.push(
      {
        id: "integration",
        label: "Integration",
        subtitle: "openrouter: model",
        x: branchX,
        y: trueY,
        icon: "integration",
        nodeStyle: "app",
        brand: "router",
        configurableId: "openrouter-model",
      },
      {
        id: "output",
        label: "Output",
        subtitle: "add: to sheet",
        x: branchX,
        y: falseY,
        icon: "output",
        nodeStyle: "app",
        brand: "sheet",
        configurableId: "add-to-sheet",
      },
    );

    connections.push(
      {
        from: "branch",
        to: "integration",
        tone: "true",
        label: "True",
      },
      {
        from: "branch",
        to: "output",
        tone: "false",
        label: "False",
      },
    );

    const mergeX = branchX + cardW + gap;
    nodes.push({
      id: "complete",
      label: "Complete",
      subtitle: "mark: done",
      x: mergeX,
      y: spineY,
      icon: "complete",
      nodeStyle: "app",
      brand: "complete",
    });

    connections.push(
      { from: "integration", to: "complete", tone: "true" },
      { from: "output", to: "complete", tone: "false" },
    );

    lastId = "complete";
    cursorX = mergeX + cardW + gap;
  } else {
    nodes.push({
      id: "output",
      label: "Output",
      subtitle: "add: to sheet",
      x: cursorX,
      y: spineY,
      icon: "output",
      nodeStyle: "app",
      brand: "sheet",
      configurableId: "add-to-sheet",
    });
    connections.push({ from: "ai-settings", to: "output" });

    lastId = "output";
    cursorX += cardW + gap;

    nodes.push({
      id: "complete",
      label: "Complete",
      subtitle: "mark: done",
      x: cursorX,
      y: spineY,
      icon: "complete",
      nodeStyle: "app",
      brand: "complete",
    });
    connections.push({ from: "output", to: "complete" });

    lastId = "complete";
    cursorX += cardW + gap;
  }

  nodes.push({
    id: "review",
    label: "Review",
    subtitle: "check: result",
    x: cursorX,
    y: spineY,
    icon: "review",
    nodeStyle: "app",
    brand: "review",
  });
  connections.push({ from: lastId, to: "review", dashed: true });

  const addX = cursorX + cardW + gap;
  nodes.push({
    id: "add-step",
    label: "Add",
    subtitle: "",
    x: addX,
    y: spineY + (CANVAS_NODE_HEIGHT - CANVAS_ADD_SIZE) / 2,
    icon: "add",
    nodeStyle: "placeholder",
    brand: "add",
    width: CANVAS_ADD_SIZE,
    height: CANVAS_ADD_SIZE,
  });
  connections.push({ from: "review", to: "add-step", dashed: true });

  return {
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    nodes,
    connections,
    configurableNodes,
    requiresTopic,
  };
}

export const WORKFLOW_TEMPLATES: Record<WorkflowType, WorkflowTemplate> = {
  "generate-idea-posts": buildFlowTemplate("generate-idea-posts"),
  "generate-content-post": buildFlowTemplate("generate-content-post"),
};

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

export const LINKABLE_APPS = [
  {
    id: "asana",
    name: "Asana",
    description: "Track work and manage projects across teams.",
    color: "#F06A6A",
    initial: "A",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Collaborate on interface design in real time.",
    color: "#A259FF",
    initial: "F",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Send campaigns and grow your audience.",
    color: "#FFE01B",
    initial: "M",
    darkText: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Message teammates and automate channel updates.",
    color: "#4A154B",
    initial: "S",
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Sync playlists and listening activity.",
    color: "#1DB954",
    initial: "Sp",
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    description: "Connect editor events to your workflows.",
    color: "#007ACC",
    initial: "V",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Bridge thousands of apps into one flow.",
    color: "#FF4A00",
    initial: "Z",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Trigger actions from meetings and webinars.",
    color: "#2D8CFF",
    initial: "Zo",
  },
] as const;
