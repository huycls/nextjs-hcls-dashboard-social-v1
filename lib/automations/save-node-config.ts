import type {
  JobCredentialRefs,
  WorkflowCredentials,
  WorkflowItem,
} from "@/lib/automations/data";
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
  /** Refs tới user_credentials — BE upsert secret và gắn vào job */
  credentialRefs?: JobCredentialRefs;
};

/** Persist node config + credentials trên automation job (không đụng workflows) */
export async function saveWorkflowNodeConfig(
  jobId: string,
  payload: SaveNodeConfigPayload,
  workflowFallback?: BackendWorkflow | null,
): Promise<SaveNodeConfigResult> {
  const id = jobId.trim();
  if (!id) {
    return { ok: false, message: "Cần có Job ID." };
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
          ...(payload.credentialRefs?.apiKeyCredentialId
            ? {
                apiKeyCredentialId:
                  payload.credentialRefs.apiKeyCredentialId.trim(),
              }
            : {}),
          ...(payload.credentialRefs?.googleCredentialId
            ? {
                googleCredentialId:
                  payload.credentialRefs.googleCredentialId.trim(),
              }
            : {}),
          ...(payload.credentialRefs?.wordpressCredentialId
            ? {
                wordpressCredentialId:
                  payload.credentialRefs.wordpressCredentialId.trim(),
              }
            : {}),
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
        message: "Đã lưu cấu hình.",
        workflow: null,
      };
    }

    return {
      ok: true,
      message: "Đã lưu cấu hình.",
      workflow: mapBackendJobToWorkflowItem(job, workflow),
    };
  } catch {
    return {
      ok: false,
      message: "Không thể lưu cấu hình. Vui lòng thử lại.",
    };
  }
}
