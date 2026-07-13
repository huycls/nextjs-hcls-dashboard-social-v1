import type {
  WorkflowItem,
  WorkflowNodeConfig,
  WorkflowType,
} from "@/lib/automations/data";
import { normalizeWorkflowCredentials } from "@/lib/automations/data";
import {
  mapBackendJobToWorkflowItem,
  mapBackendWorkflow,
  parseApiError,
  parseAutomationsListResponse,
  type BackendJob,
  type BackendWorkflow,
} from "@/lib/automations/automations-api";
import { getAutomationUrl, getAutomationsListUrl } from "@/lib/automations/automations-server";
import { getJobUrl } from "@/lib/automations/jobs-server";

const STORAGE_KEY = "Avispark-workflows";

function readStorage(): WorkflowItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WorkflowItem[];
  } catch {
    return [];
  }
}

function writeStorage(workflows: WorkflowItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  window.dispatchEvent(new Event("Avispark-workflows-updated"));
}

export function loadWorkflows(): WorkflowItem[] {
  return readStorage();
}

export function saveWorkflows(workflows: WorkflowItem[]) {
  writeStorage(workflows);
}

export function getWorkflowById(id: string): WorkflowItem | undefined {
  return readStorage().find((workflow) => workflow.id === id);
}

function formatLastModified(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Sync danh sách automations (jobs) từ backend */
export async function fetchWorkflows(): Promise<WorkflowItem[]> {
  const response = await fetch(getAutomationsListUrl(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = await response.json();
  const { workflows, jobs } = parseAutomationsListResponse(data);
  const workflowById = new Map(workflows.map((workflow) => [workflow.id, workflow]));

  const automations = jobs.flatMap((job) => {
    const workflow = workflowById.get(job.workflowId);
    if (!workflow) return [];
    return [mapBackendJobToWorkflowItem(job, workflow)];
  });

  writeStorage(automations);
  return automations;
}

/** Lấy 1 automation (job hoặc workflow) từ BE — luôn refresh để load credentials */
export async function fetchWorkflowById(id: string): Promise<WorkflowItem> {
  // Try job first (list items are jobs)
  const jobResponse = await fetch(getJobUrl(id), {
    cache: "no-store",
  });

  if (jobResponse.ok) {
    const job = (await jobResponse.json()) as BackendJob;
    const workflowResponse = await fetch(getAutomationUrl(job.workflowId), {
      cache: "no-store",
    });

    if (!workflowResponse.ok) {
      throw new Error(await parseApiError(workflowResponse));
    }

    const automation = mapBackendJobToWorkflowItem(
      job,
      (await workflowResponse.json()) as BackendWorkflow,
    );
    const workflows = readStorage();
    writeStorage([
      automation,
      ...workflows.filter((item) => item.id !== automation.id),
    ]);
    return automation;
  }

  // Fallback: workflow id (create flow navigates here)
  const workflowResponse = await fetch(getAutomationUrl(id), {
    cache: "no-store",
  });

  if (!workflowResponse.ok) {
    throw new Error(await parseApiError(workflowResponse));
  }

  const automation = mapBackendWorkflow(
    (await workflowResponse.json()) as BackendWorkflow,
  );
  const workflows = readStorage();
  writeStorage([
    automation,
    ...workflows.filter((item) => item.id !== automation.id),
  ]);
  return automation;
}

/** Tạo workflow trên NestJS — webhook URL theo type */
export async function createWorkflow(
  name: string,
  type: WorkflowType,
): Promise<WorkflowItem> {
  const response = await fetch(getAutomationsListUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name.trim(), type }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const workflow = mapBackendWorkflow(
    (await response.json()) as BackendWorkflow,
  );
  const workflows = readStorage();
  writeStorage([
    workflow,
    ...workflows.filter((item) => item.id !== workflow.id),
  ]);

  return workflow;
}

export function updateWorkflowFromBackend(workflow: WorkflowItem) {
  const workflows = readStorage().map((item) =>
    item.id === workflow.id ? { ...item, ...workflow } : item,
  );
  writeStorage(workflows);
}

export function updateWorkflow(
  id: string,
  patch: Partial<Pick<WorkflowItem, "name" | "status">>,
) {
  const workflows = readStorage().map((workflow) =>
    workflow.id === id
      ? {
          ...workflow,
          ...patch,
          lastModified: formatLastModified(new Date()),
        }
      : workflow,
  );

  writeStorage(workflows);
}

export function deleteWorkflowById(id: string) {
  writeStorage(readStorage().filter((workflow) => workflow.id !== id));
}

/** Xóa automation (job) trên BE rồi cập nhật cache local */
export async function deleteWorkflowJob(id: string): Promise<void> {
  const response = await fetch(getJobUrl(id), {
    method: "DELETE",
  });

  // Already gone on BE — still clear local cache
  if (!response.ok && response.status !== 404) {
    throw new Error(await parseApiError(response));
  }

  deleteWorkflowById(id);
}

export function updateWorkflowConfig(
  id: string,
  config: WorkflowNodeConfig,
) {
  const normalized: WorkflowNodeConfig = {
    ...config,
    credentials: normalizeWorkflowCredentials(config.credentials),
  };

  const workflows = readStorage().map((workflow) =>
    workflow.id === id
      ? {
          ...workflow,
          config: normalized,
          lastModified: formatLastModified(new Date()),
        }
      : workflow,
  );

  writeStorage(workflows);
}

export function incrementWorkflowTriggers(id: string) {
  const workflows = readStorage().map((workflow) =>
    workflow.id === id
      ? {
          ...workflow,
          triggers: workflow.triggers + 1,
          lastModified: "Just now",
        }
      : workflow,
  );

  writeStorage(workflows);
}
