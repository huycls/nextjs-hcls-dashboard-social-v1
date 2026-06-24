"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BrandLogo } from "@/components/home/brand-logo";

type NavDropdown = {
  label: string;
  items: { label: string; href: string; description?: string }[];
};

const navDropdowns: NavDropdown[] = [
  {
    label: "Features",
    items: [
      {
        label: "Workflow builder",
        href: "#",
        description: "Design automations visually",
      },
      {
        label: "Integrations",
        href: "#",
        description: "Connect your favorite tools",
      },
      {
        label: "Analytics",
        href: "#",
        description: "Track execution health",
      },
    ],
  },
  {
    label: "Solutions",
    items: [
      {
        label: "For startups",
        href: "#",
        description: "Scale ops without extra headcount",
      },
      {
        label: "For enterprises",
        href: "#",
        description: "Secure, compliant automation",
      },
      {
        label: "For developers",
        href: "#",
        description: "API-first workflow platform",
      },
    ],
  },
];

function NavDropdownMenu({ label, items }: NavDropdown) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:text-heading"
        aria-expanded={open}>
        {label}
        <ChevronDown
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 transition hover:bg-surface-elevated">
              <span className="text-sm font-medium text-heading">
                {item.label}
              </span>
              {item.description && (
                <span className="mt-0.5 block text-xs text-[#333333]d">
                  {item.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function HomeNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-lg">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5">
          <BrandLogo className="h-5 w-5 shrink-0" />
          <span className="text-lg font-bold tracking-tight text-heading">
            Flowaxon
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden items-center md:flex">
            {navDropdowns.map((dropdown) => (
              <NavDropdownMenu
                key={dropdown.label}
                {...dropdown}
              />
            ))}
            <Link
              href="/articles"
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:text-heading">
              Blog
            </Link>
          </nav>

          <div className="ml-2 flex items-center gap-2 sm:ml-4">
            <ThemeToggle variant="icon" />
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-heading transition hover:bg-surface-elevated">
              Login
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-background transition hover:bg-primary-hover">
              <BrandLogo
                className="h-3.5 w-3.5 shrink-0"
                variant="light"
              />
              <span className="hidden sm:inline">Get Started for Free</span>
              <span className="sm:hidden">Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
