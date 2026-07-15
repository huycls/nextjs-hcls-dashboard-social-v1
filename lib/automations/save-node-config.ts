import type { WorkflowCredentials, WorkflowItem } from "@/lib/automations/data";
import {
  mapBackendJobToWorkflowItem,
  parseApiError,
  type BackendJob,
  type BackendWorkflow,
} from "@/lib/automations/automations-api";
import { getAutomationUrl } from "@/lib/automations/automations-server";
import { getJobUrl } from "@/lib/automations/jobs-server";

export type SaveNodeConfigResult = {
  ok: boolean;
  message: string;
  workflow?: WorkflowItem | null;
};

type SaveNodeConfigPayload = {
  topic?: string;
  name?: string;
  credentials: Pick<
    WorkflowCredentials,
    "openRouterApiKey" | "model" | "spreadsheetId"
  >;
};

/** Persist node config + credentials trên automation job (không đụng workflows) */
export async function saveWorkflowNodeConfig(
  jobId: string,
  payload: SaveNodeConfigPayload,
  workflowFallback?: BackendWorkflow | null,
): Promise<SaveNodeConfigResult> {
  const id = jobId.trim();
  if (!id) {
    return { ok: false, message: "Job ID is required." };
  }

  try {
    const response = await fetch(`${getJobUrl(id)}/node-config`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: payload.topic?.trim() ?? "",
        ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
        credentials: {
          openRouterApiKey: payload.credentials.openRouterApiKey.trim(),
          model: payload.credentials.model.trim(),
          spreadsheetId: payload.credentials.spreadsheetId.trim(),
        },
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: await parseApiError(response),
      };
    }

    const job = (await response.json()) as BackendJob;
    let workflow = workflowFallback ?? null;

    if (!workflow && job.workflowId) {
      const workflowResponse = await fetch(getAutomationUrl(job.workflowId), {
        cache: "no-store",
        credentials: "include",
      });
      if (workflowResponse.ok) {
        workflow = (await workflowResponse.json()) as BackendWorkflow;
      }
    }

    if (!workflow) {
      return {
        ok: true,
        message: "Config saved.",
        workflow: null,
      };
    }

    return {
      ok: true,
      message: "Config saved.",
      workflow: mapBackendJobToWorkflowItem(job, workflow),
    };
  } catch {
    return {
      ok: false,
      message: "Failed to save config. Please try again.",
    };
  }
}
