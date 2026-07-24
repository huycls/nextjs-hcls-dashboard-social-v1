"use client";

import { WorkflowActivityLog } from "@/components/templates/automations/workflow-activity-log";

export function ActivityLogPage() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border bg-surface px-6 py-5 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Nhật ký hoạt động
        </h1>
        <p className="mt-1 text-sm text-muted">
          Theo dõi cập nhật trạng thái và thông báo theo workflow
        </p>
      </div>

      <WorkflowActivityLog />
    </div>
  );
}
