export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Automating your workflow operations with AI.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--node-green-bg)] px-3 py-1.5 text-xs font-medium text-[var(--node-green)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--node-green)]" />
          AI Active
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-[var(--primary-foreground,#fff)]">
          HN
        </div>
      </div>
    </header>
  );
}
