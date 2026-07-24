import { AlertTriangle, CheckCircle2 } from "lucide-react";

const integrations = [
  {
    name: "n8n Workflows",
    lastSync: "2 phút trước",
    status: "Đã kết nối",
    tone: "success" as const,
    logo: "n8",
  },
  {
    name: "Google Sheets",
    lastSync: "15 phút trước",
    status: "Đã kết nối",
    tone: "success" as const,
    logo: "GS",
  },
  {
    name: "OpenRouter API",
    lastSync: "1 giờ trước",
    status: "Đang đồng bộ",
    tone: "warning" as const,
    logo: "OR",
  },
  {
    name: "Slack Webhooks",
    lastSync: "3 giờ trước",
    status: "Cần chú ý",
    tone: "warning" as const,
    logo: "SL",
  },
];

const badgeStyles = {
  success: "bg-[var(--node-green-bg)] text-[var(--node-green)]",
  warning:
    "bg-[var(--status-warning-bg,var(--node-orange-bg))] text-[var(--status-warning,var(--node-orange))]",
};

const iconStyles = {
  success: "text-[var(--node-green)]",
  warning: "text-[var(--status-warning,var(--node-orange))]",
};

export function IntegrationStatus() {
  return (
    <section className="surface-card rounded-xl bg-surface p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-heading">
          Trạng thái tích hợp
        </h2>
        <p className="mt-1 text-sm text-muted">
          Trạng thái thời gian thực của các hệ thống đã kết nối
        </p>
      </div>

      <ul className="divide-y divide-border">
        {integrations.map(({ name, lastSync, status, tone, logo }) => (
          <li
            key={name}
            className="flex 2xl:items-center 2xl:flex-row lg:flex-col flex-row justify-between gap-3 py-4 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-[11px] font-bold text-muted">
                {logo}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-heading">
                  {name}
                </p>
                <p className="text-xs text-muted">Đồng bộ lần cuối: {lastSync}</p>
              </div>
            </div>

            <div className="flex justify-end shrink-0 items-center gap-1">
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
