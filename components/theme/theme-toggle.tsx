"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

type ThemeToggleProps = {
  variant?: "switch" | "icon";
  label?: string;
  className?: string;
};

export function ThemeToggle({
  variant = "switch",
  label = "Dark Mode",
  className,
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          toggleTheme();
        }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={
          className ??
          "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition hover:bg-surface-elevated hover:text-heading"
        }>
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 ${className ?? ""}`}>
      <span
        id="theme-toggle-label"
        className="text-sm text-foreground">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-labelledby="theme-toggle-label"
        onClick={(event) => {
          event.stopPropagation();
          toggleTheme();
        }}
        className={`relative h-6 w-11 shrink-0 rounded-full transition cursor-pointer ${
          isDark ? "bg-primary" : "bg-border"
        }`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${
            isDark ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
