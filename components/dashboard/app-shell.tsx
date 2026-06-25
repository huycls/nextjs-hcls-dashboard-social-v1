"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { Sidebar } from "@/components/dashboard/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    function handleViewportChange(event: MediaQueryListEvent | MediaQueryList) {
      if (event.matches) {
        setSidebarOpen(false);
      }
    }

    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen]);

  return (
    <div
      data-scope="dashboard"
      className="flex min-h-screen bg-canvas">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="relative flex max-h-screen min-w-0 flex-1 flex-col overflow-y-scroll">
        {!sidebarOpen && (
          <button
            type="button"
            aria-label="Open dashboard menu"
            onClick={() => setSidebarOpen(true)}
            className="fixed left-0 top-20 z-30 inline-flex h-10 cursor-pointer w-10 items-center justify-center rounded-r-xl border border-border bg-surface text-heading shadow-[var(--shadow-card)] transition hover:bg-surface-elevated xl:hidden">
            <LayoutDashboard className="h-5 w-5" />
          </button>
        )}

        {children}
      </main>

      <RightSidebar />
    </div>
  );
}
