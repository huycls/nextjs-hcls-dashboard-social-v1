"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  Plus,
  Workflow,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const workflowStats = [
  { label: "Active Workflows", value: "12" },
  { label: "Runs Today", value: "147" },
  { label: "Success Rate", value: "96.3%", accent: true },
  { label: "Avg Runtime", value: "2.3s" },
];

const recentActivity = [
  {
    title: "CRM Lead Assignment",
    time: "2 min ago",
    tone: "green" as const,
  },
  {
    title: "Content Post Generator",
    time: "18 min ago",
    tone: "blue" as const,
  },
  {
    title: "Invoice Reconciliation",
    time: "1 hr ago",
    tone: "orange" as const,
  },
  {
    title: "Slack Webhook Sync",
    time: "3 hr ago",
    tone: "green" as const,
  },
];

const toneDot: Record<(typeof recentActivity)[number]["tone"], string> = {
  green: "bg-[var(--node-green)]",
  blue: "bg-[var(--node-blue)]",
  orange: "bg-[var(--status-warning,var(--node-orange))]",
};

function shouldShowRightSidebar(pathname: string) {
  return !/\/dashboard\/automations\/[^/]+\/edit$/.test(pathname);
}

export function RightSidebar() {
  const pathname = usePathname();

  if (!shouldShowRightSidebar(pathname)) {
    return null;
  }

  const isAutomations = pathname.startsWith("/dashboard/automations");

  return (
    <aside className="hidden h-screen w-[280px] shrink-0 flex-col border-l border-border bg-sidebar xl:flex">
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6">
        <section className="surface-card rounded-xl bg-surface p-4">
          <h2 className="text-sm font-semibold text-heading">Workflow Stats</h2>
          <dl className="mt-4 space-y-3">
            {workflowStats.map(({ label, value, accent }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3">
                <dt className="text-xs text-muted">{label}</dt>
                <dd
                  className={`text-sm font-semibold ${
                    accent ? "text-[var(--node-green)]" : "text-heading"
                  }`}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="mb-3 px-1 text-sm font-semibold text-heading">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/automations/new"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-center transition hover:border-[var(--node-blue-border)] hover:bg-surface-elevated">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--node-blue-bg)] text-[var(--node-blue)]">
                <Plus className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-heading">New Flow</span>
            </Link>
            <Link
              href="/dashboard/automations"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-center transition hover:border-[var(--node-green-border)] hover:bg-surface-elevated">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--node-green-bg)] text-[var(--node-green)]">
                <Workflow className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-heading">Automations</span>
            </Link>
            <button
              type="button"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-center transition hover:border-[var(--node-orange-border)] hover:bg-surface-elevated">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--node-orange-bg)] text-[var(--node-orange)]">
                <Bot className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-heading">AI Agent</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-center transition hover:border-border hover:bg-surface-elevated">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-muted">
                <Zap className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium text-heading">Trigger</span>
            </button>
          </div>
        </section>

        {isAutomations && (
          <section className="surface-card rounded-xl bg-surface p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--node-green)]" />
              <h2 className="text-sm font-semibold text-heading">Live Status</h2>
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--node-green)]" />
              3 workflows running
            </p>
          </section>
        )}

        <section>
          <h2 className="mb-3 px-1 text-sm font-semibold text-heading">
            Recent Activity
          </h2>
          <ul className="space-y-1">
            {recentActivity.map(({ title, time, tone }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition hover:bg-sidebar-hover">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot[tone]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-heading">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">{time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-border px-4 py-4">
        <ThemeToggle className="rounded-lg border border-border bg-surface px-3 py-2.5" />
      </div>
    </aside>
  );
}
