import type {
  WorkflowItem,
  WorkflowNodeConfig,
  WorkflowType,
} from "@/lib/automations/data";
import {
  mapBackendWorkflow,
  parseApiError,
  type BackendWorkflow,
} from "@/lib/automations/automations-api";

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

/** Sync danh sách workflow từ NestJS qua Next.js proxy */
export async function fetchWorkflows(): Promise<WorkflowItem[]> {
  const response = await fetch("/api/automations", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as BackendWorkflow[];
  const workflows = data.map(mapBackendWorkflow);
  writeStorage(workflows);
  return workflows;
}

/** Lấy 1 workflow từ BE nếu chưa có trong cache */
export async function fetchWorkflowById(id: string): Promise<WorkflowItem> {
  const cached = getWorkflowById(id);
  if (cached) return cached;

  const response = await fetch(`/api/automations/${encodeURIComponent(id)}`, {
    cache: "no-store",
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

/** Tạo workflow trên NestJS — webhook URL theo type */
export async function createWorkflow(
  name: string,
  type: WorkflowType,
): Promise<WorkflowItem> {
  const response = await fetch("/api/automations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export function updateWorkflowConfig(
  id: string,
  config: WorkflowNodeConfig,
) {
  const workflows = readStorage().map((workflow) =>
    workflow.id === id
      ? {
          ...workflow,
          config,
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
