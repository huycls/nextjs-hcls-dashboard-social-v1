import type { AppId, WorkflowItem, WorkflowType } from "@/lib/automations/data";

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
  nodeCredentials?: Array<{
    id: string;
    nodeTypeId: string;
    credentialId: string;
    config?: Record<string, string>;
  }>;
};

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
      credentials: {},
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
