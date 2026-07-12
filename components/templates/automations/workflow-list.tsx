"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MoreHorizontal,
  Network,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Loading } from "@/components/atoms/Loading";
import { AppIcons } from "@/components/templates/automations/app-icons";
import { CreateWorkflowDialog } from "@/components/templates/automations/create-workflow-dialog";
import { WorkflowStatusCell } from "@/components/templates/automations/workflow-status-cell";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  WORKFLOW_TYPE_LABELS,
  type WorkflowItem,
} from "@/lib/automations/data";
import { useRunningWorkflowsPolling } from "@/lib/automations/use-workflow-polling";
import {
  deleteWorkflowJob,
  fetchWorkflows,
  loadWorkflows,
  saveWorkflows,
} from "@/lib/automations/workflow-store";
import {
  notifyWorkflowStoreUpdated,
  useWorkflows,
} from "@/lib/automations/use-workflow-store";

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

type WorkflowListProps = {
  embedded?: boolean;
};

export function WorkflowList({ embedded = false }: WorkflowListProps) {
  const workflows = useWorkflows();
  useRunningWorkflowsPolling();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowItem | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchWorkflows()
      .then(() => {
        if (!cancelled) {
          notifyWorkflowStoreUpdated();
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load workflows.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(workflows.length / pageSize));
  const effectivePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (effectivePage - 1) * pageSize;
    return workflows.slice(start, start + pageSize);
  }, [workflows, effectivePage, pageSize]);

  const visiblePages = useMemo(
    () => getVisiblePages(effectivePage, totalPages),
    [effectivePage, totalPages],
  );

  const allPageSelected =
    pageItems.length > 0 &&
    pageItems.every((workflow) => selectedIds.has(workflow.id));

  function toggleSelectAll() {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (allPageSelected) {
        pageItems.forEach((workflow) => next.delete(workflow.id));
      } else {
        pageItems.forEach((workflow) => next.add(workflow.id));
      }

      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function handleToggleStatus(id: string, enabled: boolean) {
    const next = loadWorkflows().map((workflow) =>
      workflow.id === id
        ? {
            ...workflow,
            status: enabled ? ("Active" as const) : ("Paused" as const),
            lastModified: "Just now",
          }
        : workflow,
    );
    saveWorkflows(next);
    notifyWorkflowStoreUpdated();
  }

  async function handleDelete(id: string) {
    await deleteWorkflowJob(id);
    notifyWorkflowStoreUpdated();

    const nextWorkflows = loadWorkflows();
    const nextTotalPages = Math.max(
      1,
      Math.ceil(nextWorkflows.length / pageSize),
    );

    setPage((currentPage) => Math.min(currentPage, nextTotalPages));
    setSelectedIds((selected) => {
      const next = new Set(selected);
      next.delete(id);
      return next;
    });
  }

  async function confirmDelete() {
    if (!workflowToDelete || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await handleDelete(workflowToDelete.id);
      setWorkflowToDelete(null);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete automation.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function handlePageSizeChange(nextSize: number) {
    setPageSize(nextSize);
    setPage(1);
  }

  return (
    <div className="relative flex flex-1 flex-col">
      {loading ? (
        <Loading
          label="Loading workflows"
          message="Loading workflows..."
        />
      ) : null}
      {!embedded && (
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-5 lg:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-heading">
              Automations
            </h1>
            <p className="mt-1 text-sm text-muted">
              Manage your workflow projects and integrations
            </p>
          </div>

          <button
            type="button"
            aria-label="Add new workflow"
            onClick={() => setCreateDialogOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background transition hover:bg-primary-hover">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {loadError && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
            {loadError}
          </div>
        )}

        <div className="surface-card overflow-hidden rounded-2xl bg-surface-elevated">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted" />
              <h2 className="text-sm font-semibold text-heading">
                Recent Workflows
              </h2>
            </div>
            <button
              type="button"
              aria-label="Workflow list options"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all workflows on this page"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-border"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Apps</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last modified</th>
                  <th className="w-24 px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? null : pageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-muted">
                      No workflows found. Create a new project to get started.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((workflow) => {
                    const isSelected = selectedIds.has(workflow.id);

                    return (
                      <tr
                        key={workflow.id}
                        className={`border-b border-border last:border-0 ${
                          isSelected ? "bg-surface" : "hover:bg-surface/60"
                        }`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            aria-label={`Select ${workflow.name}`}
                            checked={isSelected}
                            onChange={() => toggleSelect(workflow.id)}
                            className="h-4 w-4 rounded border-border"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-muted">
                              <Network className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-heading">
                              {workflow.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-foreground">
                          {WORKFLOW_TYPE_LABELS[workflow.type]}
                        </td>

                        <td className="px-4 py-4">
                          {workflow.apps.length > 0 ? (
                            <AppIcons apps={workflow.apps} />
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <WorkflowStatusCell
                            workflow={workflow}
                            onToggle={(enabled) =>
                              handleToggleStatus(workflow.id, enabled)
                            }
                          />
                        </td>

                        <td className="px-4 py-4 text-muted">
                          {workflow.lastModified}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/dashboard/automations/${workflow.id}/edit`}
                              aria-label={`Edit ${workflow.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground">
                              <Pencil className="h-5 w-5" />
                            </Link>
                            <button
                              type="button"
                              aria-label={`Delete ${workflow.name}`}
                              onClick={() => {
                                setDeleteError(null);
                                setWorkflowToDelete(workflow);
                              }}
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-rose-500/10 hover:text-rose-400">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={effectivePage <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>

              {visiblePages.map((pageNumber, index) =>
                pageNumber === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm text-muted">
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={
                      pageNumber === effectivePage ? "page" : undefined
                    }
                    onClick={() => setPage(pageNumber)}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${
                      pageNumber === effectivePage
                        ? "border-primary bg-primary text-background"
                        : "border-border bg-surface-elevated text-foreground hover:bg-surface"
                    }`}>
                    {pageNumber}
                  </button>
                ),
              )}

              <button
                type="button"
                aria-label="Next page"
                disabled={effectivePage >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted">
              <label
                htmlFor="page-size"
                className="font-medium">
                Show
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(event) =>
                  handlePageSizeChange(Number(event.target.value))
                }
                className="h-9 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none focus:border-primary/50">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option
                    key={size}
                    value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>from: {workflows.length}</span>
            </div>
          </div>
        </div>
      </div>

      {!embedded && (
        <CreateWorkflowDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onCreated={() => notifyWorkflowStoreUpdated()}
        />
      )}

      {workflowToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!deleting) {
              setWorkflowToDelete(null);
              setDeleteError(null);
            }
          }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-workflow-title"
            aria-describedby="delete-workflow-description"
            className="surface-card w-full max-w-md rounded-2xl bg-surface-elevated p-6 shadow-[var(--shadow-card-hover)]"
            onClick={(event) => event.stopPropagation()}>
            <h2
              id="delete-workflow-title"
              className="text-lg font-semibold text-heading">
              Delete automation?
            </h2>
            <p
              id="delete-workflow-description"
              className="mt-2 text-sm text-muted">
              Are you sure you want to delete{" "}
              <span className="font-medium text-heading">
                {workflowToDelete.name}
              </span>
              ? This removes the job from the database and cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-3 text-sm text-rose-400">{deleteError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setWorkflowToDelete(null);
                  setDeleteError(null);
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface disabled:opacity-40">
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-40">
                {deleting ? "Deleting..." : "Delete automation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
