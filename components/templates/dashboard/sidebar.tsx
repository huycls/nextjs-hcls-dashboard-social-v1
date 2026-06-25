"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Plug,
  Shield,
  Workflow,
} from "lucide-react";
import { BrandLogo } from "@/components/templates/home/brand-logo";
import { cn } from "@/lib/utils/tailwind-merge";

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
  { label: "Log Activity", href: "#", icon: FileText },
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

  function handleNavClick() {
    onClose?.();
  }

  return (
    <aside
      className={cn(
        "flex h-screen w-[240px] shrink-0 flex-col border-r border-border bg-sidebar px-4 py-6",
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
            className="h-5 w-5 shrink-0"
            variant="primary"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-heading">
              Avispark
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground">
              AI Copilot
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
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
    </aside>
  );
}
