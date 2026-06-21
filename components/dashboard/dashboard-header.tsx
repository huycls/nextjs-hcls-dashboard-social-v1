import { Plus, Sparkles } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[28px]">
          Welcome back, Fajar 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Here&apos;s a quick summary of your automation workflows today.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Create Workflow
        </button>
        <button
          type="button"
          className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 p-[1.5px] transition hover:opacity-90"
        >
          <span className="inline-flex h-[37px] items-center gap-2 rounded-[10px] bg-white px-4 text-sm font-medium text-gray-900">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Try AI
          </span>
        </button>
      </div>
    </header>
  );
}
