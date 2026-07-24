import seed from "@/common/data/pre-authorization.json";

export const PRE_AUTH_STORAGE_KEY = "Avispark-pre-authorization";

export type WorkspaceRole = "admin" | "member";

export type MemberStatus = "active" | "invited" | "disabled";

export type WorkflowPermission = "view" | "edit" | "run" | "manage";

export type WorkspaceUser = {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  title: string;
  status?: MemberStatus;
};

export type PreAuthWorkflow = {
  id: string;
  name: string;
};

export type WorkflowGrant = {
  userId: string;
  workflowId: string;
  permissions: WorkflowPermission[];
};

export type PreAuthorizationState = {
  admin: WorkspaceUser;
  members: WorkspaceUser[];
  workflows: PreAuthWorkflow[];
  grants: WorkflowGrant[];
};

export const WORKFLOW_PERMISSIONS: Array<{
  id: WorkflowPermission;
  label: string;
  description: string;
}> = [
  {
    id: "view",
    label: "Xem",
    description: "Xem chi tiết workflow và lịch sử chạy",
  },
  {
    id: "edit",
    label: "Sửa",
    description: "Thay đổi node, cài đặt và thông tin xác thực",
  },
  {
    id: "run",
    label: "Chạy",
    description: "Kích hoạt chạy thử và chạy production",
  },
  {
    id: "manage",
    label: "Quản lý",
    description: "Chia sẻ quyền truy cập và xóa workflow",
  },
];

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: "Đang hoạt động",
  invited: "Đã mời",
  disabled: "Đã vô hiệu hóa",
};

function cloneSeed(): PreAuthorizationState {
  return {
    admin: { ...seed.admin, role: "admin" },
    members: seed.members.map((member) => ({
      ...member,
      role: "member" as const,
      status: member.status as MemberStatus,
    })),
    workflows: seed.workflows.map((workflow) => ({ ...workflow })),
    grants: seed.grants.map((grant) => ({
      ...grant,
      permissions: [...grant.permissions] as WorkflowPermission[],
    })),
  };
}

export function loadPreAuthorizationState(): PreAuthorizationState {
  if (typeof window === "undefined") return cloneSeed();

  try {
    const raw = localStorage.getItem(PRE_AUTH_STORAGE_KEY);
    if (!raw) return cloneSeed();

    const parsed = JSON.parse(raw) as PreAuthorizationState;
    if (!parsed?.admin || !Array.isArray(parsed.members)) return cloneSeed();

    return {
      admin: parsed.admin,
      members: parsed.members,
      workflows: parsed.workflows?.length ? parsed.workflows : cloneSeed().workflows,
      grants: Array.isArray(parsed.grants) ? parsed.grants : [],
    };
  } catch {
    return cloneSeed();
  }
}

export function savePreAuthorizationState(state: PreAuthorizationState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRE_AUTH_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("avispark-pre-authorization-updated"));
}

export function getUserInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
  }
  return (parts[0] ?? "U").slice(0, 2).toUpperCase();
}

export function getGrantsForUser(
  grants: WorkflowGrant[],
  userId: string,
): WorkflowGrant[] {
  return grants.filter((grant) => grant.userId === userId);
}

export function getPermissionsForUserWorkflow(
  grants: WorkflowGrant[],
  userId: string,
  workflowId: string,
): WorkflowPermission[] {
  return (
    grants.find(
      (grant) => grant.userId === userId && grant.workflowId === workflowId,
    )?.permissions ?? []
  );
}

/** Keep permission hierarchy coherent: edit/run/manage imply view; manage implies edit+run */
export function normalizePermissions(
  permissions: WorkflowPermission[],
): WorkflowPermission[] {
  const set = new Set(permissions);

  if (set.has("manage")) {
    set.add("view");
    set.add("edit");
    set.add("run");
  }
  if (set.has("edit") || set.has("run")) {
    set.add("view");
  }

  return WORKFLOW_PERMISSIONS.map((item) => item.id).filter((id) => set.has(id));
}

export function togglePermission(
  current: WorkflowPermission[],
  permission: WorkflowPermission,
  enabled: boolean,
): WorkflowPermission[] {
  const set = new Set(current);

  if (enabled) {
    set.add(permission);
  } else {
    set.delete(permission);
    if (permission === "view") {
      set.clear();
    }
    if (permission === "manage") {
      // keep lower levels as-is when turning manage off
    }
  }

  return normalizePermissions([...set]);
}

export function upsertGrant(
  grants: WorkflowGrant[],
  userId: string,
  workflowId: string,
  permissions: WorkflowPermission[],
): WorkflowGrant[] {
  const normalized = normalizePermissions(permissions);
  const without = grants.filter(
    (grant) => !(grant.userId === userId && grant.workflowId === workflowId),
  );

  if (normalized.length === 0) return without;

  return [...without, { userId, workflowId, permissions: normalized }];
}

export function countGrantedWorkflows(grants: WorkflowGrant[], userId: string) {
  return new Set(
    grants.filter((grant) => grant.userId === userId).map((g) => g.workflowId),
  ).size;
}
