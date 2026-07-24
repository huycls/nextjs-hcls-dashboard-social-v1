"use client";

import type { WorkflowItem } from "@/lib/automations/data";
import { WorkflowStatusBadge } from "@/components/templates/automations/workflow-status-badge";

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
        checked ? "bg-secondary" : "bg-border"
      }`}>
      <span className="sr-only">{label}</span>
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface-elevated shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

type WorkflowStatusCellProps = {
  workflow: WorkflowItem;
  onToggle: (enabled: boolean) => void;
};

export function WorkflowStatusCell({
  workflow,
  onToggle,
}: WorkflowStatusCellProps) {
  if (
    workflow.status === "Running" ||
    workflow.status === "Failed" ||
    workflow.status === "Draft"
  ) {
    return <WorkflowStatusBadge status={workflow.status} />;
  }

  return (
    <div className="flex items-center gap-2">
      <StatusToggle
        checked={workflow.status === "Active"}
        label={`Bật/tắt trạng thái cho ${workflow.name}`}
        onChange={onToggle}
      />
      <WorkflowStatusBadge status={workflow.status} />
    </div>
  );
}
