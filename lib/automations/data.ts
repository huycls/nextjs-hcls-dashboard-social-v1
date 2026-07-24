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
  Active: "Đang hoạt động",
  Paused: "Tạm dừng",
  Draft: "Nháp",
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
    title: "Tạo ý tưởng bài đăng",
    description: "Brainstorm và tạo ý tưởng bài đăng cho kênh mạng xã hội.",
  },
  {
    id: "generate-content-post",
    typeId: WORKFLOW_TYPE_IDS["generate-content-post"],
    title: "Tạo nội dung bài đăng",
    description: "Tạo nội dung bài đăng hoàn chỉnh, sẵn sàng xuất bản trên nhiều nền tảng.",
  },
];

export const WORKFLOW_TYPE_LABELS: Record<WorkflowType, string> = {
  "generate-idea-posts": "Tạo ý tưởng bài đăng",
  "generate-content-post": "Tạo nội dung bài đăng",
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

/**
 * Shared workflow credentials (Approach C).
 * Google OAuth tokens live on BE only — FE keeps connection status cache.
 */
export type WorkflowCredentials = {
  openRouterApiKey: string;
  model: string;
  spreadsheetId: string;
  /** Cached from BE `/integrations/google/status` — never store tokens here */
  googleConnected: boolean;
  googleEmail: string;
};

/** Refs → `user_credentials.id` — secrets nằm ở vault, job chỉ giữ id */
export type JobCredentialRefs = {
  apiKeyCredentialId?: string;
  googleCredentialId?: string;
  wordpressCredentialId?: string;
};

export type WorkflowNodeConfig = {
  workflowId: string;
  topic: string;
  credentials: WorkflowCredentials;
  credentialRefs?: JobCredentialRefs;
};

export const DEFAULT_WORKFLOW_CREDENTIALS: WorkflowCredentials = {
  openRouterApiKey: "",
  model: "",
  spreadsheetId: "",
  googleConnected: false,
  googleEmail: "",
};

export const DEFAULT_WORKFLOW_CONFIG: WorkflowNodeConfig = {
  workflowId: "",
  topic: "",
  credentials: { ...DEFAULT_WORKFLOW_CREDENTIALS },
};

export function normalizeWorkflowCredentials(
  value: unknown,
): WorkflowCredentials {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_WORKFLOW_CREDENTIALS };
  }

  const raw = value as Record<string, unknown>;

  // Legacy per-node shape → ignore secrets, start clean
  if ("apiKey" in raw || "secretKey" in raw) {
    return { ...DEFAULT_WORKFLOW_CREDENTIALS };
  }

  return {
    openRouterApiKey:
      typeof raw.openRouterApiKey === "string" ? raw.openRouterApiKey : "",
    model: typeof raw.model === "string" ? raw.model : "",
    spreadsheetId:
      typeof raw.spreadsheetId === "string" ? raw.spreadsheetId : "",
    googleConnected: Boolean(raw.googleConnected),
    googleEmail: typeof raw.googleEmail === "string" ? raw.googleEmail : "",
  };
}

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
