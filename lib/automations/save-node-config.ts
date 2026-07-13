import type { WorkflowCredentials, WorkflowItem } from "@/lib/automations/data";
import {
  mapBackendWorkflow,
  parseApiError,
  type BackendWorkflow,
} from "@/lib/automations/automations-api";
import { getAutomationUrl } from "@/lib/automations/automations-server";

export type SaveNodeConfigResult = {
  ok: boolean;
  message: string;
  workflow?: WorkflowItem | null;
};

type SaveNodeConfigPayload = {
  topic?: string;
  credentials: Pick<
    WorkflowCredentials,
    "openRouterApiKey" | "model" | "spreadsheetId"
  >;
};

/** Persist node config + credentials on BE workflow */
export async function saveWorkflowNodeConfig(
  workflowId: string,
  payload: SaveNodeConfigPayload,
): Promise<SaveNodeConfigResult> {
  const id = workflowId.trim();
  if (!id) {
    return { ok: false, message: "Workflow ID is required." };
  }

  try {
    const response = await fetch(`${getAutomationUrl(id)}/node-config`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: payload.topic?.trim() ?? "",
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

    const data = (await response.json()) as BackendWorkflow;
    return {
      ok: true,
      message: "Config saved.",
      workflow: mapBackendWorkflow(data),
    };
  } catch {
    return {
      ok: false,
      message: "Failed to save config. Please try again.",
    };
  }
}
