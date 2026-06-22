"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { AppIcons } from "@/components/automations/app-icons";
import { CreateWorkflowDialog } from "@/components/automations/create-workflow-dialog";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  WORKFLOW_TYPE_LABELS,
  type WorkflowItem,
} from "@/lib/automations/data";
import {
  deleteWorkflowById,
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

function StatusToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-sky-500" : "bg-gray-200"
      }`}>
      <span className="sr-only">{label}</span>
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function WorkflowList() {
  const workflows = useWorkflows();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowItem | null>(
    null,
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  function handleDelete(id: string) {
    deleteWorkflowById(id);
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

  function confirmDelete() {
    if (!workflowToDelete) return;

    handleDelete(workflowToDelete.id);
    setWorkflowToDelete(null);
  }

  function handlePageSizeChange(nextSize: number) {
    setPageSize(nextSize);
    setPage(1);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Automations
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your workflow projects and integrations
          </p>
        </div>

        <button
          type="button"
          aria-label="Add new workflow"
          onClick={() => setCreateDialogOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-800">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Workflows
              </h2>
            </div>
            <button
              type="button"
              aria-label="Workflow list options"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all workflows on this page"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
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
                {pageItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-gray-500">
                      No workflows found. Create a new project to get started.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((workflow) => {
                    const isSelected = selectedIds.has(workflow.id);
                    const isActive = workflow.status === "Active";

                    return (
                      <tr
                        key={workflow.id}
                        className={`border-b border-gray-50 last:border-0 ${
                          isSelected ? "bg-gray-50" : "hover:bg-gray-50/60"
                        }`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            aria-label={`Select ${workflow.name}`}
                            checked={isSelected}
                            onChange={() => toggleSelect(workflow.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                              <Network className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {workflow.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {WORKFLOW_TYPE_LABELS[workflow.type]}
                        </td>

                        <td className="px-4 py-4">
                          {workflow.apps.length > 0 ? (
                            <AppIcons apps={workflow.apps} />
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <StatusToggle
                            checked={isActive}
                            label={`Toggle status for ${workflow.name}`}
                            onChange={(enabled) =>
                              handleToggleStatus(workflow.id, enabled)
                            }
                          />
                        </td>

                        <td className="px-4 py-4 text-gray-500">
                          {workflow.lastModified}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/automations/${workflow.id}/edit`}
                              aria-label={`Edit ${workflow.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                              <Pencil className="h-5 w-5" />
                            </Link>
                            <button
                              type="button"
                              aria-label={`Delete ${workflow.name}`}
                              onClick={() => setWorkflowToDelete(workflow)}
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600">
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

          <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={effectivePage <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>

              {visiblePages.map((pageNumber, index) =>
                pageNumber === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm text-gray-400">
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
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <label htmlFor="page-size" className="font-medium">
                Show
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(event) =>
                  handlePageSizeChange(Number(event.target.value))
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-300">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>from: {workflows.length}</span>
            </div>
          </div>
        </div>
      </div>

      <CreateWorkflowDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={() => notifyWorkflowStoreUpdated()}
      />

      {workflowToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setWorkflowToDelete(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-workflow-title"
            aria-describedby="delete-workflow-description"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}>
            <h2
              id="delete-workflow-title"
              className="text-lg font-semibold text-gray-900">
              Delete workflow?
            </h2>
            <p
              id="delete-workflow-description"
              className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {workflowToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setWorkflowToDelete(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
                Delete workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
