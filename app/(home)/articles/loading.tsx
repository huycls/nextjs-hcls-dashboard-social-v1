export default function ArticlesLoading() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse text-center">
          <div className="mx-auto h-4 w-16 rounded bg-surface-elevated" />
          <div className="mx-auto mt-4 h-10 w-72 max-w-full rounded bg-surface-elevated" />
          <div className="mx-auto mt-5 h-5 w-full max-w-2xl rounded bg-surface-elevated" />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <div className="animate-pulse">
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-9 w-24 rounded-full bg-surface-elevated"
                />
              ))}
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="aspect-[16/10] rounded-xl bg-surface-elevated" />
                  <div className="mt-4 h-4 w-24 rounded bg-surface-elevated" />
                  <div className="mt-3 h-5 w-full rounded bg-surface-elevated" />
                  <div className="mt-2 h-4 w-full rounded bg-surface-elevated" />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden animate-pulse rounded-2xl border border-border bg-surface p-5 lg:block">
            <div className="h-4 w-32 rounded bg-surface-elevated" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-16 w-20 shrink-0 rounded-lg bg-surface-elevated" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full rounded bg-surface-elevated" />
                    <div className="h-3 w-20 rounded bg-surface-elevated" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
