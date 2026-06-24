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
import { BrandLogo } from "@/components/home/brand-logo";

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col bg-sidebar px-4 py-6">
      <div className="mb-8 px-2">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <BrandLogo className="h-5 w-5 shrink-0" variant="primary" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-heading">
              Flowaxon
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-sidebar-active text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-heading"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
