import type {
  WorkflowCredentials,
  WorkflowItem,
} from "@/lib/automations/data";
import {
  mapBackendWorkflow,
  type BackendWorkflow,
} from "@/lib/automations/automations-api";
import { getJobsRunUrl, JOBS_API } from "@/lib/automations/jobs-server";

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

type BackendErrorPayload = {
  message?: string;
  job?: JobStatusPayload | null;
  workflow?: BackendWorkflow | null;
};

type TriggerJobOptions = {
  useProductionWebhook?: boolean;
  /** OpenRouter settings only — Google token is resolved on BE (Approach C) */
  credentials?: Pick<
    WorkflowCredentials,
    "openRouterApiKey" | "model" | "spreadsheetId"
  >;
};

function mapWorkflowFromResponse(
  workflow: BackendWorkflow | null | undefined,
): WorkflowItem | null {
  return workflow ? mapBackendWorkflow(workflow) : null;
}

function parseErrorMessage(text: string) {
  try {
    const parsed = JSON.parse(text) as { message?: string; error?: string };
    return parsed.message ?? parsed.error ?? text;
  } catch {
    return text;
  }
}

export async function triggerWorkflowJob(
  workflowId: string,
  topic?: string,
  options?: TriggerJobOptions,
): Promise<TriggerJobResult> {
  try {
    const payload: {
      workflowId: string;
      topic?: string;
      useProductionWebhook?: boolean;
      credentials?: {
        openRouterApiKey: string;
        model: string;
        spreadsheetId?: string;
      };
    } = { workflowId };

    const trimmedTopic = topic?.trim();
    if (trimmedTopic) {
      payload.topic = trimmedTopic;
    }

    if (options?.useProductionWebhook !== undefined) {
      payload.useProductionWebhook = options.useProductionWebhook;
    }

    const openRouterApiKey = options?.credentials?.openRouterApiKey?.trim();
    const model = options?.credentials?.model?.trim();
    const spreadsheetId = options?.credentials?.spreadsheetId?.trim();

    if (openRouterApiKey && model) {
      payload.credentials = {
        openRouterApiKey,
        model,
        ...(spreadsheetId ? { spreadsheetId } : {}),
      };
    }

    const response = await fetch(getJobsRunUrl(), {
      method: JOBS_API.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = (await response.json().catch(() => null)) as {
        job?: JobStatusPayload;
        workflow?: BackendWorkflow;
      } | null;

      return {
        ok: true,
        status: response.status,
        message: "Workflow job started successfully.",
        job: data?.job ?? null,
        workflow: mapWorkflowFromResponse(data?.workflow),
      };
    }

    const errorText = await response.text().catch(() => "");
    let errorPayload: BackendErrorPayload | null = null;

    try {
      errorPayload = JSON.parse(errorText) as BackendErrorPayload;
    } catch {
      // not JSON
    }

    return {
      ok: false,
      status: response.status,
      message: errorText
        ? `Backend returned ${response.status}: ${parseErrorMessage(errorText).slice(0, 200)}`
        : `Request failed with status ${response.status}`,
      job: errorPayload?.job ?? null,
      workflow: mapWorkflowFromResponse(errorPayload?.workflow),
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Failed to send job request. Please try again.",
    };
  }
}
