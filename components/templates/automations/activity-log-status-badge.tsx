import {
  ACTIVITY_LOG_LEVEL_LABELS,
  type ActivityLogLevel,
} from "@/lib/automations/activity-logs";

const LEVEL_STYLES: Record<ActivityLogLevel, string> = {
  success:
    "bg-[var(--node-green-bg)] text-[var(--node-green)] border-[var(--node-green-border)]",
  failed: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  running:
    "bg-[var(--node-blue-bg)] text-[var(--node-blue)] border-[var(--node-blue-border)]",
  warning:
    "bg-[var(--status-warning-bg,var(--node-orange-bg))] text-[var(--status-warning,var(--node-orange))] border-[var(--node-orange-border)]",
  info: "bg-surface text-muted border-border",
};

type ActivityLogStatusBadgeProps = {
  level: ActivityLogLevel;
  className?: string;
};

export function ActivityLogStatusBadge({
  level,
  className = "",
}: ActivityLogStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${LEVEL_STYLES[level]} ${className}`}>
      {level === "running" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}
      {ACTIVITY_LOG_LEVEL_LABELS[level]}
    </span>
  );
}

export function ActivityLogDot({ level }: { level: ActivityLogLevel }) {
  const dotStyles: Record<ActivityLogLevel, string> = {
    success: "bg-[var(--node-green)]",
    failed: "bg-rose-500",
    running: "bg-[var(--node-blue)]",
    warning: "bg-[var(--node-orange)]",
    info: "bg-muted",
  };

  return (
    <span
      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotStyles[level]} ${
        level === "running" ? "animate-pulse" : ""
      }`}
    />
  );
}
