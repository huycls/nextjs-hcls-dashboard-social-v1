"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CreateWorkflowDialog } from "@/components/templates/automations/create-workflow-dialog";
import { WorkflowList } from "@/components/templates/automations/workflow-list";
import { notifyWorkflowStoreUpdated } from "@/lib/automations/use-workflow-store";

export function AutomationsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-5 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-heading">
            Tự động hóa
          </h1>
          <p className="mt-1 text-sm text-muted">
            Quản lý dự án workflow và tích hợp của bạn
          </p>
        </div>

        <button
          type="button"
          aria-label="Thêm workflow mới"
          onClick={() => setCreateDialogOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background transition hover:bg-primary-hover">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <WorkflowList embedded />

      <CreateWorkflowDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={() => notifyWorkflowStoreUpdated()}
      />
    </div>
  );
}
