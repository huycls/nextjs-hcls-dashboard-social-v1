"use client";

import { Bell, Clock3, Plug, Sparkles } from "lucide-react";
import { useState } from "react";

const UPCOMING_INTEGRATIONS = [
  {
    name: "Slack",
    description: "Push run alerts and approvals into channels.",
  },
  {
    name: "Google Sheets",
    description: "Sync workflow outputs to shared spreadsheets.",
  },
  {
    name: "Notion",
    description: "Write generated content into team databases.",
  },
  {
    name: "Zapier",
    description: "Bridge Avispark flows with thousands of apps.",
  },
] as const;

export function IntegrationsComingSoonPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNotify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email to get notified.");
      return;
    }

    try {
      const key = "Avispark-integrations-notify";
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
      const next = Array.from(new Set([...existing, value.toLowerCase()]));
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore storage failures — still show success UX
    }

    setSubscribed(true);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="border-b border-border bg-surface px-6 py-5 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Integrations
        </h1>
        <p className="mt-1 text-sm text-muted">
          Connect external apps to your automation workspace.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <section className="surface-card relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-[var(--node-blue)]/10 blur-3xl"
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Plug className="h-6 w-6" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--node-blue-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--node-blue)]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Coming soon
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Clock3 className="h-3.5 w-3.5" />
                    Feature in progress
                  </span>
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-heading">
                  App integrations are on the way
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                  We&apos;re building a catalog to link Slack, Sheets, Notion,
                  and more directly into your workflows. You&apos;ll be able to
                  authorize apps once and reuse them across automations.
                </p>

                {!subscribed ? (
                  <form
                    onSubmit={handleNotify}
                    className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="integrations-notify-email" className="sr-only">
                        Email for launch notification
                      </label>
                      <input
                        id="integrations-notify-email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError(null);
                        }}
                        placeholder="you@company.com"
                        className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                      />
                      {error && (
                        <p className="mt-1.5 text-xs text-rose-500" role="alert">
                          {error}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-[var(--primary-foreground,#fff)] transition hover:bg-primary-hover">
                      <Bell className="h-4 w-4" />
                      Notify me
                    </button>
                  </form>
                ) : (
                  <div
                    className="mt-5 inline-flex items-start gap-2 rounded-xl border border-[var(--node-green-border)] bg-[var(--node-green-bg)] px-4 py-3 text-sm text-[var(--node-green)]"
                    role="status">
                    <Bell className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      You&apos;re on the list. We&apos;ll notify{" "}
                      <strong className="font-semibold">{email.trim()}</strong>{" "}
                      when Integrations launches.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-heading">
              Planned first wave
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {UPCOMING_INTEGRATIONS.map((item) => (
                <li
                  key={item.name}
                  className="surface-card rounded-2xl border border-dashed border-border bg-surface-elevated/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-heading">
                      {item.name}
                    </p>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Soon
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
