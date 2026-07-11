"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Plus,
  Search,
  Shield,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  MEMBER_STATUS_LABELS,
  WORKFLOW_PERMISSIONS,
  countGrantedWorkflows,
  getGrantsForUser,
  getPermissionsForUserWorkflow,
  getUserInitials,
  loadPreAuthorizationState,
  savePreAuthorizationState,
  togglePermission,
  upsertGrant,
  type MemberStatus,
  type PreAuthorizationState,
  type WorkflowPermission,
  type WorkspaceUser,
} from "@/lib/pre-authorization/data";

export function PreAuthorizationPage() {
  const [state, setState] = useState<PreAuthorizationState | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteTitle, setInviteTitle] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const loaded = loadPreAuthorizationState();
    setState(loaded);
    setSelectedUserId(loaded.members[0]?.id ?? null);
  }, []);

  function persist(next: PreAuthorizationState) {
    setState(next);
    savePreAuthorizationState(next);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  }

  const filteredMembers = useMemo(() => {
    if (!state) return [];
    const q = query.trim().toLowerCase();
    if (!q) return state.members;
    return state.members.filter(
      (member) =>
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.title.toLowerCase().includes(q),
    );
  }, [state, query]);

  const selectedMember = useMemo(() => {
    if (!state || !selectedUserId) return null;
    return state.members.find((member) => member.id === selectedUserId) ?? null;
  }, [state, selectedUserId]);

  function handleTogglePermission(
    workflowId: string,
    permission: WorkflowPermission,
    enabled: boolean,
  ) {
    if (!state || !selectedUserId) return;

    const current = getPermissionsForUserWorkflow(
      state.grants,
      selectedUserId,
      workflowId,
    );
    const nextPermissions = togglePermission(current, permission, enabled);
    const nextGrants = upsertGrant(
      state.grants,
      selectedUserId,
      workflowId,
      nextPermissions,
    );

    persist({ ...state, grants: nextGrants });
  }

  function handleInviteSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state) return;

    const name = inviteName.trim();
    const email = inviteEmail.trim().toLowerCase();
    const title = inviteTitle.trim() || "Team member";

    if (!name || !email) {
      setInviteError("Name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError("Enter a valid email.");
      return;
    }
    if (
      state.members.some((m) => m.email.toLowerCase() === email) ||
      state.admin.email.toLowerCase() === email
    ) {
      setInviteError("This email is already in the workspace.");
      return;
    }

    const member: WorkspaceUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "member",
      title,
      status: "invited",
    };

    const next = { ...state, members: [...state.members, member] };
    persist(next);
    setSelectedUserId(member.id);
    setInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteTitle("");
    setInviteError(null);
  }

  function handleStatusChange(userId: string, status: MemberStatus) {
    if (!state) return;
    persist({
      ...state,
      members: state.members.map((member) =>
        member.id === userId ? { ...member, status } : member,
      ),
    });
  }

  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted">
        Loading permissions…
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-4 border-b border-border bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-heading">
            Pre-Authorization
          </h1>
          <p className="mt-1 text-sm text-muted">
            Admin grants workflow access to child users before they can view,
            edit, or run automations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedFlash && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--node-green)]">
              <Check className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-[var(--primary-foreground,#fff)] transition hover:bg-primary-hover">
            <UserPlus className="h-4 w-4" />
            Invite user
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={Shield}
            label="Admin"
            value={state.admin.name}
            hint="Full access to all workflows"
          />
          <StatCard
            icon={Users}
            label="Child users"
            value={String(state.members.length)}
            hint={`${state.members.filter((m) => m.status === "active").length} active`}
          />
          <StatCard
            icon={Workflow}
            label="Workflows"
            value={String(state.workflows.length)}
            hint="Available for permission grants"
          />
        </div>

        <div className="grid min-h-[520px] gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <section className="surface-card flex flex-col overflow-hidden rounded-2xl bg-surface-elevated">
            <div className="border-b border-border px-4 py-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search users"
                  className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="border-b border-border px-4 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Admin
              </p>
              <AdminRow user={state.admin} />
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
              <p className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Child users
              </p>
              {filteredMembers.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No users match “{query}”.
                </p>
              ) : (
                filteredMembers.map((member) => {
                  const granted = countGrantedWorkflows(
                    state.grants,
                    member.id,
                  );
                  const active = selectedUserId === member.id;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedUserId(member.id)}
                      className={cn(
                        "mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition",
                        active
                          ? "bg-sidebar-active text-heading"
                          : "hover:bg-surface",
                      )}>
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {getUserInitials(member.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-heading">
                            {member.name}
                          </span>
                          <StatusPill status={member.status ?? "active"} />
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {member.email}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted">
                          {granted} workflow{granted === 1 ? "" : "s"} granted
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="surface-card flex flex-col overflow-hidden rounded-2xl bg-surface-elevated">
            {!selectedMember ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                <Users className="h-8 w-8 text-muted" />
                <p className="text-sm font-medium text-heading">
                  Select a child user
                </p>
                <p className="max-w-sm text-sm text-muted">
                  Choose a user on the left to assign workflow permissions.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-[var(--primary-foreground,#fff)]">
                      {getUserInitials(selectedMember.name)}
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-heading">
                        {selectedMember.name}
                      </h2>
                      <p className="text-sm text-muted">
                        {selectedMember.title} · {selectedMember.email}
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-muted">
                    Status
                    <select
                      value={selectedMember.status ?? "active"}
                      onChange={(event) =>
                        handleStatusChange(
                          selectedMember.id,
                          event.target.value as MemberStatus,
                        )
                      }
                      className="h-9 rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary/40">
                      {(
                        Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[]
                      ).map((status) => (
                        <option key={status} value={status}>
                          {MEMBER_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="border-b border-border px-5 py-3">
                  <p className="text-xs text-muted">
                    {getGrantsForUser(state.grants, selectedMember.id).length}{" "}
                    grant
                    {getGrantsForUser(state.grants, selectedMember.id)
                      .length === 1
                      ? ""
                      : "s"}{" "}
                    · Toggle permissions per workflow.{" "}
                    <span className="text-foreground">
                      Manage implies View, Edit, and Run.
                    </span>
                  </p>
                </div>

                <div className="flex-1 overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted">
                        <th className="px-5 py-3 font-medium">Workflow</th>
                        {WORKFLOW_PERMISSIONS.map((permission) => (
                          <th
                            key={permission.id}
                            className="px-3 py-3 text-center font-medium"
                            title={permission.description}>
                            {permission.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {state.workflows.map((workflow) => {
                        const permissions = getPermissionsForUserWorkflow(
                          state.grants,
                          selectedMember.id,
                          workflow.id,
                        );

                        return (
                          <tr
                            key={workflow.id}
                            className="border-b border-border last:border-0 hover:bg-surface/60">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-muted">
                                  <Workflow className="h-4 w-4" />
                                </span>
                                <span className="font-medium text-heading">
                                  {workflow.name}
                                </span>
                              </div>
                            </td>
                            {WORKFLOW_PERMISSIONS.map((permission) => {
                              const checked = permissions.includes(
                                permission.id,
                              );
                              return (
                                <td
                                  key={permission.id}
                                  className="px-3 py-4 text-center">
                                  <input
                                    type="checkbox"
                                    aria-label={`${permission.label} on ${workflow.name}`}
                                    checked={checked}
                                    onChange={(event) =>
                                      handleTogglePermission(
                                        workflow.id,
                                        permission.id,
                                        event.target.checked,
                                      )
                                    }
                                    className="h-4 w-4 rounded border-border accent-[var(--primary)]"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {inviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-user-title">
          <form
            onSubmit={handleInviteSubmit}
            className="w-full max-w-md rounded-2xl border border-border bg-surface-elevated p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2
                  id="invite-user-title"
                  className="text-lg font-semibold text-heading">
                  Invite child user
                </h2>
                <p className="mt-1 text-sm text-muted">
                  They start with no workflow access until you grant
                  permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInviteOpen(false);
                  setInviteError(null);
                }}
                className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-surface hover:text-heading">
                Close
              </button>
            </div>

            <div className="space-y-3">
              <InviteField
                id="invite-name"
                label="Full name"
                value={inviteName}
                onChange={setInviteName}
                placeholder="Lan Pham"
                required
              />
              <InviteField
                id="invite-email"
                label="Email"
                type="email"
                value={inviteEmail}
                onChange={setInviteEmail}
                placeholder="lan@hcls.local"
                required
              />
              <InviteField
                id="invite-title"
                label="Title"
                value={inviteTitle}
                onChange={setInviteTitle}
                placeholder="Content Ops"
              />
            </div>

            {inviteError && (
              <p className="mt-3 text-sm text-rose-500" role="alert">
                {inviteError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setInviteOpen(false);
                  setInviteError(null);
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface">
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-[var(--primary-foreground,#fff)] hover:bg-primary-hover">
                <Plus className="h-4 w-4" />
                Add user
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Shield;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="surface-card rounded-2xl bg-surface-elevated p-4">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-2 truncate text-lg font-semibold text-heading">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </div>
  );
}

function AdminRow({ user }: { user: WorkspaceUser }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-xs font-semibold text-white">
        {getUserInitials(user.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-heading">{user.name}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
      <span className="ml-auto rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-600">
        Admin
      </span>
    </div>
  );
}

function StatusPill({ status }: { status: MemberStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        status === "active" && "bg-[var(--node-green-bg)] text-[var(--node-green)]",
        status === "invited" && "bg-[var(--node-blue-bg)] text-[var(--node-blue)]",
        status === "disabled" && "bg-surface text-muted",
      )}>
      {MEMBER_STATUS_LABELS[status]}
    </span>
  );
}

function InviteField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-heading">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
