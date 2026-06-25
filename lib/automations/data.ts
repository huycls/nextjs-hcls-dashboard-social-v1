export type AppId =
  | "notion"
  | "trello"
  | "google"
  | "discord"
  | "slack"
  | "dropbox"
  | "stripe"
  | "hubspot"
  | "mailchimp"
  | "zendesk";

export type WorkflowStatus =
  | "Active"
  | "Paused"
  | "Draft"
  | "Running"
  | "Failed";

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  Active: "Active",
  Paused: "Paused",
  Draft: "Draft",
  Running: "Đang thực hiện",
  Failed: "Thất bại",
};

export type WorkflowType = "generate-idea-posts" | "generate-content-post";

/** n8n webhook path theo workflow type */
export const WORKFLOW_TYPE_IDS: Record<WorkflowType, string> = {
  "generate-idea-posts": "tJzVZLs9LEmdR6WH",
  "generate-content-post": "ZEMDqJJ0egeGO4FQ",
};

export const WORKFLOW_TYPES: Array<{
  id: WorkflowType;
  typeId: string;
  title: string;
  description: string;
}> = [
  {
    id: "generate-idea-posts",
    typeId: WORKFLOW_TYPE_IDS["generate-idea-posts"],
    title: "Generate Idea Posts",
    description: "Brainstorm and generate post ideas for your social channels.",
  },
  {
    id: "generate-content-post",
    typeId: WORKFLOW_TYPE_IDS["generate-content-post"],
    title: "Generate Content Post",
    description: "Create full content posts ready to publish across platforms.",
  },
];

export const WORKFLOW_TYPE_LABELS: Record<WorkflowType, string> = {
  "generate-idea-posts": "Generate Idea Posts",
  "generate-content-post": "Generate Content Post",
};

export type WorkflowBackendConfig = {
  topic: string;
  useProductionWebhook: boolean;
  webhookTestUrl: string;
  webhookProductionUrl: string;
};

export type WorkflowNodeCredential = {
  id: string;
  nodeTypeId: string;
  credentialId: string;
  config?: Record<string, string>;
};

export type WorkflowItem = {
  id: string;
  name: string;
  type: WorkflowType;
  status: WorkflowStatus;
  triggers: number;
  updatedAt: string;
  lastModified: string;
  apps: AppId[];
  /** UI editor state (topic, credentials form) */
  config?: WorkflowNodeConfig;
  /** Webhook URLs từ NestJS — set khi tạo/sync từ BE */
  backendConfig?: WorkflowBackendConfig;
  nodeCredentials?: WorkflowNodeCredential[];
};

export type WorkflowNodeConfig = {
  workflowId: string;
  topic: string;
  credentials: Partial<
    Record<string, { apiKey: string; secretKey: string }>
  >;
};

export const DEFAULT_WORKFLOW_CONFIG: WorkflowNodeConfig = {
  workflowId: "",
  topic: "",
  credentials: {},
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
