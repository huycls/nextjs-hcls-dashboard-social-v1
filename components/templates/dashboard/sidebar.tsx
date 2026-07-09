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
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Automations",
    href: "/dashboard/automations",
    icon: Workflow,
  },
  { label: "Pre-Authorization", href: "#", icon: Shield },
  { label: "Log Activity", href: "/dashboard/activity", icon: FileText },
  { label: "Integrations", href: "#", icon: Plug },
];

function isActivePath(pathname: string, href: string, exact = false) {
  if (href === "#") return false;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark } = useTheme();

  async function handleLogout() {
    await logout();
    onClose?.();
    router.replace("/login");
    router.refresh();
  }
  function handleNavClick() {
    onClose?.();
  }

  return (
    <aside
      className={cn(
        "flex h-screen w-[300px] py-10 xl:py-16 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6",
        "fixed left-0 top-0 z-50 transition-transform duration-300 ease-out",
        "xl:static xl:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
      )}>
      <div className="mb-8 px-2">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-2.5">
          <BrandLogo
            className="h-10 w-10 shrink-0"
            variant="primary"
          />
          <div className="min-w-0">
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

      <nav className="flex-1 space-y-1 pt-10 xl:pt-20">
        {mainNav.map(({ label, href, icon: Icon, exact }) => {
          const active = isActivePath(pathname, href, exact);

          return (
            <Link
              key={label}
              href={href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-sidebar-active text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-heading",
              )}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-hover hover:text-sidebar-heading">
        <LogOut className="h-4 w-4 shrink-0" />
        Logout
      </button>
    </aside>
  );
}
