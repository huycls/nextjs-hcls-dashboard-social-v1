import type { WorkflowRunEnvironment } from "@/lib/automations/workflow-environment";

const ENVIRONMENT_STYLES: Record<WorkflowRunEnvironment, string> = {
  test: "bg-[var(--node-blue-bg)] text-[var(--node-blue)] border-[var(--node-blue-border)]",
  production:
    "bg-[var(--node-green-bg)] text-[var(--node-green)] border-[var(--node-green-border)]",
};

type WorkflowEnvironmentBadgeProps = {
  environment: WorkflowRunEnvironment;
  className?: string;
};

export function WorkflowEnvironmentBadge({
  environment,
  className = "",
}: WorkflowEnvironmentBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${ENVIRONMENT_STYLES[environment]} ${className}`}>
      {environment === "test" ? "Test" : "Production"}
    </span>
  );
}
