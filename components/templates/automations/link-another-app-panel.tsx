"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { LINKABLE_APPS } from "@/lib/automations/workflow-templates";
import { cn } from "@/lib/utils/tailwind-merge";

type LinkAnotherAppPanelProps = {
  onClose: () => void;
};

export function LinkAnotherAppPanel({ onClose }: LinkAnotherAppPanelProps) {
  const [query, setQuery] = useState("");

  const apps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return LINKABLE_APPS;
    return LINKABLE_APPS.filter(
      (app) =>
        app.name.toLowerCase().includes(normalized) ||
        app.description.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-border bg-surface-elevated">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-heading">
            Liên kết ứng dụng khác
          </h2>
          <p className="mt-1 text-xs text-muted">
            Tìm tích hợp để mở rộng workflow này
          </p>
        </div>
        <button
          type="button"
          aria-label="Đóng bảng"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-heading">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-border px-5 py-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm ứng dụng"
            className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          />
        </label>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {apps.map((app) => (
          <button
            key={app.id}
            type="button"
            className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-surface">
            <span
              className={cn(
                "mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm",
                "darkText" in app && app.darkText
                  ? "text-heading"
                  : "text-white",
              )}
              style={{ backgroundColor: app.color }}>
              {app.initial}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-heading">
                {app.name}
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-muted">
                {app.description}
              </span>
            </span>
          </button>
        ))}

        {apps.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-muted">
            Không có ứng dụng khớp “{query}”.
          </p>
        )}
      </div>
    </aside>
  );
}
