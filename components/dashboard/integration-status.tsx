import { AlertTriangle, CheckCircle2 } from "lucide-react";

const integrations = [
  {
    name: "n8n Workflows",
    lastSync: "2 min ago",
    status: "Connected",
    tone: "success" as const,
    logo: "n8",
  },
  {
    name: "Google Sheets",
    lastSync: "15 min ago",
    status: "Connected",
    tone: "success" as const,
    logo: "GS",
  },
  {
    name: "OpenRouter API",
    lastSync: "1 hr ago",
    status: "Syncing",
    tone: "warning" as const,
    logo: "OR",
  },
  {
    name: "Slack Webhooks",
    lastSync: "3 hr ago",
    status: "Attention",
    tone: "warning" as const,
    logo: "SL",
  },
];

const badgeStyles = {
  success: "bg-[var(--node-green-bg)] text-[var(--node-green)]",
  warning: "bg-[var(--node-orange-bg)] text-[var(--node-orange)]",
};

const iconStyles = {
  success: "text-[var(--node-green)]",
  warning: "text-[var(--node-orange)]",
};

export function IntegrationStatus() {
  return (
    <section className="surface-card rounded-xl bg-surface p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-heading">
          Integration Status
        </h2>
        <p className="mt-1 text-sm text-[#333333]d">
          Real-time status of connected systems
        </p>
      </div>

      <ul className="divide-y divide-border">
        {integrations.map(({ name, lastSync, status, tone, logo }) => (
          <li
            key={name}
            className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-[11px] font-bold text-[#333333]d">
                {logo}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-heading">
                  {name}
                </p>
                <p className="text-xs text-[#333333]d">Last sync: {lastSync}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {tone === "success" ? (
                <CheckCircle2
                  className={`h-4 w-4 ${iconStyles[tone]}`}
                  aria-hidden
                />
              ) : (
                <AlertTriangle
                  className={`h-4 w-4 ${iconStyles[tone]}`}
                  aria-hidden
                />
              )}
              <span
                className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${badgeStyles[tone]}`}>
                {status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
