"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Plug,
  Shield,
  Workflow,
} from "lucide-react";
import { BrandLogo } from "@/components/atoms/BrandLogo";
import { cn } from "@/lib/utils/tailwind-merge";
import ShinyText from "@/components/atoms/ShinyText";
import { useTheme } from "@/components/theme/theme-provider";
import { logout } from "@/lib/auth/auth-client";

const mainNav = [
  {
    label: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Tự động hóa",
    href: "/dashboard/automations",
    icon: Workflow,
  },
  {
    label: "Ủy quyền trước",
    href: "/dashboard/pre-authorization",
    icon: Shield,
  },
  { label: "Nhật ký hoạt động", href: "/dashboard/activity", icon: FileText },
  { label: "Tích hợp", href: "/dashboard/integrations", icon: Plug },
];

function isActivePath(pathname: string, href: string, exact = false) {
  if (href === "#") return false;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark } = useTheme();

  async function handleLogout() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-border bg-sidebar",
        "w-[72px] px-2 py-5",
        "min-[1500px]:w-[300px] min-[1500px]:px-4 min-[1500px]:py-10",
      )}>
      <div className="mb-6 flex justify-center min-[1500px]:mb-8 min-[1500px]:justify-start min-[1500px]:px-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          title="Avispark">
          <BrandLogo
            className="h-9 w-9 shrink-0 min-[1500px]:h-10 min-[1500px]:w-10"
            variant="primary"
          />
          <div className="hidden min-w-0 min-[1500px]:block">
            <ShinyText
              text="Avispark"
              speed={2}
              delay={0}
              className="text-2xl font-bold"
              color={isDark ? "#ffffff" : "#333333"}
              shineColor={isDark ? "#f49e0b" : "#00a73e"}
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
            <p className="truncate text-[11px] text-sidebar-foreground">
              AI Copilot
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 pt-4 min-[1500px]:items-stretch min-[1500px]:space-y-1 min-[1500px]:pt-16">
        {mainNav.map(({ label, href, icon: Icon, exact }) => {
          const active = isActivePath(pathname, href, exact);

          return (
            <Link
              key={label}
              href={href}
              title={label}
              aria-label={label}
              className={cn(
                "group relative flex items-center justify-center rounded-xl transition",
                "h-11 w-11",
                "min-[1500px]:h-auto min-[1500px]:w-full min-[1500px]:justify-start min-[1500px]:gap-3 min-[1500px]:rounded-lg min-[1500px]:px-3 min-[1500px]:py-2.5",
                active
                  ? "bg-sidebar-active text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-heading",
              )}>
              <Icon className="h-5 w-5 shrink-0 min-[1500px]:h-4 min-[1500px]:w-4" />
              <span className="hidden text-sm font-medium min-[1500px]:inline">
                {label}
              </span>
              <span
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-heading opacity-0 shadow-md transition group-hover:opacity-100 min-[1500px]:hidden">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        title="Đăng xuất"
        aria-label="Đăng xuất"
        className={cn(
          "group relative mt-4 flex items-center justify-center rounded-xl text-sidebar-foreground transition hover:bg-sidebar-hover hover:text-sidebar-heading",
          "h-11 w-11 self-center",
          "min-[1500px]:h-auto min-[1500px]:w-full min-[1500px]:justify-start min-[1500px]:gap-3 min-[1500px]:rounded-lg min-[1500px]:px-3 min-[1500px]:py-2.5",
        )}>
        <LogOut className="h-5 w-5 shrink-0 min-[1500px]:h-4 min-[1500px]:w-4" />
        <span className="hidden text-sm font-medium min-[1500px]:inline">
          Đăng xuất
        </span>
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-heading opacity-0 shadow-md transition group-hover:opacity-100 min-[1500px]:hidden">
          Đăng xuất
        </span>
      </button>
    </aside>
  );
}
