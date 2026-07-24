"use client";

import Link from "next/link";
import { getUserInitials } from "@/lib/auth/user-profile";
import { useUserProfile } from "@/lib/auth/use-user-profile";

export function DashboardHeader() {
  const { profile } = useUserProfile();
  const initials = getUserInitials(profile.name, profile.email);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Tổng quan
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tự động hóa vận hành workflow bằng AI.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--node-green-bg)] px-3 py-1.5 text-xs font-medium text-[var(--node-green)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--node-green)]" />
          AI đang hoạt động
        </span>
        <Link
          href="/dashboard/profile"
          aria-label="Mở cài đặt hồ sơ"
          title={profile.name || "Hồ sơ"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-[var(--primary-foreground,#fff)] transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          {initials}
        </Link>
      </div>
    </header>
  );
}
