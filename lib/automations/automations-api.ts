import type {
  AppId,
  WorkflowCredentials,
  WorkflowItem,
  WorkflowStatus,
  WorkflowType,
} from "@/lib/automations/data";
import {
  DEFAULT_WORKFLOW_CREDENTIALS,
  normalizeWorkflowCredentials,
} from "@/lib/automations/data";

export type BackendUiCredentials = {
  openRouterApiKey?: string;
  model?: string;
  spreadsheetId?: string;
};

export type BackendJobSettings = {
  model?: string;
  spreadsheetId?: string;
};

export type BackendJobCredentialRefs = {
  apiKeyCredentialId?: string;
  googleCredentialId?: string;
  wordpressCredentialId?: string;
};

export type BackendJob = {
  id: string;
  siteId?: string | null;
  userId?: string | null;
  workflowId: string;
  name?: string;
  topic?: string;
  /** Non-secret settings on job */
  settings?: BackendJobSettings;
  /** Refs → user_credentials.id */
  credentialRefs?: BackendJobCredentialRefs;
  /** Hydrated for editor (from vault) — list thường để trống api key */
  credentials?: BackendUiCredentials;
  status: string;
  errorMessage?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AutomationsListResponse = {
  workflows: BackendWorkflow[];
  jobs?: BackendJob[];
};

export type BackendWorkflow = {
  id: string;
  siteId?: string | null;
  name: string;
  type: WorkflowType;
  status: WorkflowItem["status"];
  triggers: number;
  updatedAt: string;
  lastModified: string;
  apps: AppId[];
  config: {
    topic: string;
    useProductionWebhook: boolean;
    webhookTestUrl: string;
    webhookProductionUrl: string;
  };
  /** Approach C credentials persisted via PATCH /node-config */
  credentials?: BackendUiCredentials;
  nodeCredentials?: Array<{
    id: string;
    nodeTypeId: string;
    credentialId: string;
    config?: Record<string, string>;
  }>;
};

/** BE list: `{ workflows, jobs }` — workflows = type templates, jobs = automations */
export function parseAutomationsListResponse(data: unknown): {
  workflows: BackendWorkflow[];
  jobs: BackendJob[];
} {
  if (Array.isArray(data)) {
    return { workflows: data as BackendWorkflow[], jobs: [] };
  }

  if (data && typeof data === "object") {
    const response = data as AutomationsListResponse;
    return {
      workflows: Array.isArray(response.workflows) ? response.workflows : [],
      jobs: Array.isArray(response.jobs) ? response.jobs : [],
    };
  }

  return { workflows: [], jobs: [] };
}

function formatJobLastModified(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function mapJobStatusToWorkflowStatus(status: string): WorkflowStatus {
  switch (status.toLowerCase()) {
    case "processing":
    case "running":
      return "Running";
    case "failed":
      return "Failed";
    case "draft":
    case "pending":
    case "queued":
      return "Draft";
    case "completed":
    case "success":
    case "active":
      return "Active";
    case "paused":
      return "Paused";
    default:
      return "Active";
  }
}

function mapJobCredentials(
  job: BackendJob,
  workflow: BackendWorkflow,
): WorkflowCredentials {
  // 1) Hydrated từ vault (GET job chi tiết)
  if (job.credentials) {
    return normalizeWorkflowCredentials({
      ...job.credentials,
      model: job.credentials.model || job.settings?.model || "",
      spreadsheetId:
        job.credentials.spreadsheetId || job.settings?.spreadsheetId || "",
    });
  }

  // 2) Non-secret settings trên job (chưa hydrate key)
  if (job.settings) {
    return normalizeWorkflowCredentials({
      ...DEFAULT_WORKFLOW_CREDENTIALS,
      model: job.settings.model ?? "",
      spreadsheetId: job.settings.spreadsheetId ?? "",
    });
  }

  if (workflow.credentials) {
    return normalizeWorkflowCredentials(workflow.credentials);
  }

  // Fallback: legacy nodeCredentials.config
  const openRouterNode = workflow.nodeCredentials?.find(
    (node) =>
      node.nodeTypeId === "openrouter-model" ||
      node.nodeTypeId === "gemini-model",
  );
  const sheetNode = workflow.nodeCredentials?.find(
    (node) =>
      node.nodeTypeId === "add-to-sheet" ||
      node.nodeTypeId === "google-sheet",
  );

  return normalizeWorkflowCredentials({
    ...DEFAULT_WORKFLOW_CREDENTIALS,
    openRouterApiKey:
      openRouterNode?.config?.apiKey ??
      openRouterNode?.config?.openRouterApiKey ??
      "",
    model: openRouterNode?.config?.model ?? "",
    spreadsheetId: sheetNode?.config?.spreadsheetId ?? "",
  });
}

/** Job (automation) + workflow type → item hiển thị trên list */
export function mapBackendJobToWorkflowItem(
  job: BackendJob,
  workflow: BackendWorkflow,
): WorkflowItem {
  const topic = job.topic?.trim() ?? "";
  const name = job.name?.trim() || topic || workflow.name;
  const updatedAt = job.updatedAt ?? workflow.updatedAt;

  return {
    id: job.id,
    name,
    type: workflow.type,
    status: mapJobStatusToWorkflowStatus(job.status),
    triggers: workflow.triggers ?? 0,
    updatedAt: updatedAt.slice(0, 10),
    lastModified: formatJobLastModified(updatedAt),
    apps: workflow.apps ?? [],
    config: {
      workflowId: workflow.id,
      topic,
      credentials: mapJobCredentials(job, workflow),
    },
    backendConfig: workflow.config,
    nodeCredentials: workflow.nodeCredentials ?? [],
  };
}

export function mapBackendWorkflow(workflow: BackendWorkflow): WorkflowItem {
  return {
    id: workflow.id,
    name: workflow.name,
    type: workflow.type,
    status: workflow.status,
    triggers: workflow.triggers,
    updatedAt: workflow.updatedAt,
    lastModified: workflow.lastModified,
    apps: workflow.apps ?? [],
    config: {
      workflowId: workflow.id,
      topic: workflow.config?.topic ?? "",
      credentials: mapJobCredentials({ workflowId: workflow.id, status: "draft" }, workflow),
    },
    backendConfig: workflow.config,
    nodeCredentials: workflow.nodeCredentials ?? [],
  };
}

export async function parseApiError(response: Response) {
  const text = await response.text().catch(() => "");

  try {
    const parsed = JSON.parse(text) as { message?: string | string[] };
    const message = parsed.message;

    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  } catch {
    // ignore
  }

  return text || `Request failed with status ${response.status}`;
}
