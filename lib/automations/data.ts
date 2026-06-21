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

export type WorkflowStatus = "Active" | "Paused" | "Draft";

export type WorkflowType = "generate-idea-posts" | "generate-content-post";

export const WORKFLOW_TYPES: Array<{
  id: WorkflowType;
  title: string;
  description: string;
}> = [
  {
    id: "generate-idea-posts",
    title: "Generate Idea Posts",
    description: "Brainstorm and generate post ideas for your social channels.",
  },
  {
    id: "generate-content-post",
    title: "Generate Content Post",
    description: "Create full content posts ready to publish across platforms.",
  },
];

export const WORKFLOW_TYPE_LABELS: Record<WorkflowType, string> = {
  "generate-idea-posts": "Generate Idea Posts",
  "generate-content-post": "Generate Content Post",
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
  config?: WorkflowNodeConfig;
};

export type WorkflowNodeConfig = {
  topic: string;
  useProductionWebhook: boolean;
  /** Paste Test URL từ n8n Webhook node (ưu tiên hơn .env) */
  webhookTestUrl: string;
  /** Paste Production URL từ n8n */
  webhookProductionUrl: string;
  credentials: Partial<
    Record<string, { apiKey: string; secretKey: string }>
  >;
};

export const DEFAULT_WORKFLOW_CONFIG: WorkflowNodeConfig = {
  topic: "",
  useProductionWebhook: false,
  webhookTestUrl: "",
  webhookProductionUrl: "",
  credentials: {},
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
