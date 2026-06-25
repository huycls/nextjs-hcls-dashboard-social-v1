import {
  WORKFLOW_STATUS_LABELS,
  type WorkflowStatus,
} from "@/lib/automations/data";

const STATUS_STYLES: Record<WorkflowStatus, string> = {
  Active:
    "bg-[var(--node-green-bg)] text-[var(--node-green)] border-[var(--node-green-border)]",
  Paused: "bg-surface text-muted border-border",
  Draft: "bg-surface text-muted border-border",
  Running:
    "bg-[var(--node-blue-bg)] text-[var(--node-blue)] border-[var(--node-blue-border)]",
  Failed: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

type WorkflowStatusBadgeProps = {
  status: WorkflowStatus;
  className?: string;
};

export function WorkflowStatusBadge({
  status,
  className = "",
}: WorkflowStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]} ${className}`}>
      {status === "Running" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}
      {WORKFLOW_STATUS_LABELS[status]}
    </span>
  );
}
