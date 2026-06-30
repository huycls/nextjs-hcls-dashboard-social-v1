import type { WorkflowItem } from "@/lib/automations/data";
import {
  mapBackendWorkflow,
  type BackendWorkflow,
} from "@/lib/automations/automations-api";

export type JobStatusPayload = {
  id: string;
  workflowId: string;
  status: string;
  errorMessage?: string | null;
  topic?: string;
};

export type TriggerJobResult = {
  ok: boolean;
  status: number;
  message: string;
  job?: JobStatusPayload | null;
  workflow?: WorkflowItem | null;
};

function mapWorkflowFromResponse(
  workflow: BackendWorkflow | null | undefined,
): WorkflowItem | null {
  return workflow ? mapBackendWorkflow(workflow) : null;
}

/**
 * Gọi qua Next.js API route (same-origin) → backend /api/jobs/run.
 */
export async function triggerWorkflowJob(
  workflowId: string,
  topic?: string,
  options?: { useProductionWebhook?: boolean },
): Promise<TriggerJobResult> {
  try {
    const payload: {
      workflowId: string;
      topic?: string;
      useProductionWebhook?: boolean;
    } = { workflowId };
    const trimmedTopic = topic?.trim();

    if (trimmedTopic) {
      payload.topic = trimmedTopic;
    }

    if (options?.useProductionWebhook !== undefined) {
      payload.useProductionWebhook = options.useProductionWebhook;
    }

    const response = await fetch("/api/jobs/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as TriggerJobResult & {
      workflow?: BackendWorkflow;
    };

    return {
      ok: data.ok,
      status: data.status,
      message: data.message,
      job: data.job ?? null,
      workflow: mapWorkflowFromResponse(data.workflow),
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Failed to send job request. Please try again.",
    };
  }
}
