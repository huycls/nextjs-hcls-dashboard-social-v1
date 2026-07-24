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
      label: "Bắt đầu",
      subtitle: "Khi nhấn",
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
      label: "Xử lý",
      subtitle: "prepare: payload",
      x: processX,
      y: spineY,
      icon: "process",
      nodeStyle: "accent",
      brand: "ai",
    },
    {
      id: "ai-settings",
      label: "Cài đặt AI",
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
      label: "Nếu",
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
        label: "Tích hợp",
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
        label: "Đầu ra",
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
        label: "Đúng",
      },
      {
        from: "branch",
        to: "output",
        tone: "false",
        label: "Sai",
      },
    );

    const mergeX = branchX + cardW + gap;
    nodes.push({
      id: "complete",
      label: "Hoàn tất",
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
      label: "Hoàn tất",
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
    label: "Rà soát",
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
    label: "Thêm",
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
    title: "Kích hoạt",
    description: "Cấu hình thời điểm và cách workflow bắt đầu.",
    kind: "webhook",
  },
  "gemini-model": {
    title: "Cài đặt AI",
    description: "OpenRouter API key và model để tạo nội dung.",
    kind: "credentials",
  },
  "openrouter-model": {
    title: "Tích hợp",
    description: "Kết nối OpenRouter dùng chung với Cài đặt AI.",
    kind: "credentials",
  },
  "add-to-sheet": {
    title: "Đầu ra",
    description: "Kết nối Google và chọn bảng tính cho kết quả.",
    kind: "credentials",
  },
};

export const LINKABLE_APPS = [
  {
    id: "asana",
    name: "Asana",
    description: "Theo dõi công việc và quản lý dự án trong nhóm.",
    color: "#F06A6A",
    initial: "A",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Cộng tác thiết kế giao diện theo thời gian thực.",
    color: "#A259FF",
    initial: "F",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Gửi chiến dịch và phát triển khán giả.",
    color: "#FFE01B",
    initial: "M",
    darkText: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Nhắn tin với đồng đội và tự động hóa cập nhật kênh.",
    color: "#4A154B",
    initial: "S",
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Đồng bộ playlist và hoạt động nghe nhạc.",
    color: "#1DB954",
    initial: "Sp",
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    description: "Kết nối sự kiện từ trình soạn thảo vào workflow.",
    color: "#007ACC",
    initial: "V",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Kết nối hàng nghìn ứng dụng trong một luồng.",
    color: "#FF4A00",
    initial: "Z",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Kích hoạt hành động từ cuộc họp và hội thảo trực tuyến.",
    color: "#2D8CFF",
    initial: "Zo",
  },
] as const;
