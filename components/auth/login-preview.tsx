import {
  Bell,
  FileText,
  LayoutDashboard,
  Plug,
  Plus,
  Redo2,
  Search,
  Undo2,
  Users,
  Workflow,
} from "lucide-react";

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Automations", icon: Workflow, active: true },
  { label: "Integrations", icon: Plug, active: false },
];

const settingsNav = [
  { label: "Log Activity", icon: FileText },
  { label: "Team Access", icon: Users },
  { label: "Notifications", icon: Bell },
];

export function LoginPreview() {
  return (
    <div className="relative h-full min-h-[640px] overflow-hidden rounded-[28px] border border-gray-200 bg-[#F3F4F6] shadow-2xl">
      <div className="flex h-full">
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-gray-200 bg-[#FAFAFA] p-4 sm:flex">
          <div className="mb-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gray-900" />
              <span className="text-sm font-semibold text-gray-900">
                Flowaxon
              </span>
            </div>
            <button
              type="button"
              aria-label="Create new"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <div className="h-9 rounded-xl border border-gray-200 bg-white pl-9" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Main
              </p>
              <ul className="space-y-1">
                {mainNav.map(({ label, icon: Icon, active }) => (
                  <li key={label}>
                    <div
                      className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium ${
                        active
                          ? "bg-gray-900 text-white"
                          : "text-gray-600"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Settings
              </p>
              <ul className="space-y-1">
                {settingsNav.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <div className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-gray-600">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-gray-200 bg-white p-3">
            <p className="text-xs font-semibold text-gray-900">
              Upgrade Pro Plan
            </p>
            <p className="mt-1 text-[10px] leading-4 text-gray-500">
              Unlock advanced automation features and priority support.
            </p>
            <button
              type="button"
              className="mt-3 h-8 w-full rounded-lg bg-gray-900 text-[11px] font-medium text-white"
            >
              Upgrade Now
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Automations
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Testing mode</span>
              <div
                role="switch"
                aria-checked="true"
                aria-label="Testing mode"
                className="relative h-5 w-9 rounded-full bg-blue-500"
              >
                <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
              </div>
            </div>
          </div>

          <div
            className="relative flex-1 p-6"
            style={{
              backgroundImage:
                "radial-gradient(circle, #E5E7EB 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <div className="absolute left-6 top-6 flex gap-2">
              <button
                type="button"
                aria-label="Undo"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Redo"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mx-auto mt-16 max-w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-900">
                How are task being added to this project?
              </p>
              <div className="mt-3 space-y-2">
                <div className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700">
                  Manually
                </div>
                <div className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-700">
                  Use Template
                </div>
              </div>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600"
              >
                <Plus className="h-3.5 w-3.5" />
                Add action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
