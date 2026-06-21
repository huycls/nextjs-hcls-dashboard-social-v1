"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Plug,
  Search,
  Settings,
  Sun,
  User,
  Users,
  Workflow,
} from "lucide-react";

const mainNav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Automations", href: "/automations", icon: Workflow },
  { label: "Integrations", href: "#", icon: Plug },
];

const settingsNav = [
  { label: "Log Activity", icon: FileText },
  { label: "Team Access", icon: Users },
  { label: "Notifications", icon: Bell },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-gray-200 bg-[#FAFAFA] px-4 py-5">
      <div className="sticky left-0 top-0 flex h-full flex-col">
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Sun className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Flowaxon
          </span>
        </div>

        <div className="relative mb-6 px-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search"
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-16 text-sm text-gray-700 outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:inline-block">
            ⌘ K
          </kbd>
        </div>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto">
          <div>
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Main
            </p>
            <ul className="space-y-1">
              {mainNav.map(({ label, href, icon: Icon }) => {
                const active = isActivePath(pathname, href);

                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:bg-white hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Settings
            </p>
            <ul className="space-y-1">
              {settingsNav.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="relative mt-4">
          {menuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5">
                <span id="dark-mode-label" className="text-sm text-gray-700">
                  Dark Mode
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={darkMode}
                  aria-labelledby="dark-mode-label"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    darkMode ? "bg-gray-900" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      darkMode ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:border-gray-300"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-200 to-orange-300 text-sm font-semibold text-orange-800">
              HN
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                Huy Nguyen
              </p>
              <p className="truncate text-xs text-gray-500">
                huynguyen@flowaxon.com
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
