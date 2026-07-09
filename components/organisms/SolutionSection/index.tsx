function DashboardMock({ className }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] ${className ?? ""}`}>
      <div className="flex items-center gap-1 border-b border-border px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
      </div>
      <div className="flex gap-2 p-3">
        <div className="w-16 shrink-0 space-y-1.5">
          <div className="h-2 rounded bg-surface-elevated" />
          <div className="h-2 w-3/4 rounded bg-surface-elevated" />
          <div className="h-2 w-1/2 rounded bg-surface-elevated" />
          <div className="mt-3 h-2 rounded bg-primary/20" />
          <div className="h-2 w-2/3 rounded bg-surface-elevated" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-16 rounded-lg bg-background" />
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-8 rounded bg-background" />
            <div className="h-8 rounded bg-background" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailSidebarMock({ className }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card-hover)] ${className ?? ""}`}>
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-semibold text-heading">Alicia Koch</p>
        <p className="text-[10px] text-foreground">alicia@acme.ai</p>
      </div>
      <div className="space-y-0.5 p-2">
        {[
          { label: "Inbox", count: "128" },
          { label: "Drafts", count: "9" },
          { label: "Sent", count: "" },
          { label: "Junk", count: "23" },
          { label: "Trash", count: "" },
          { label: "Archive", count: "" },
        ].map(({ label, count }) => (
          <div
            key={label}
            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[10px] ${
              label === "Inbox"
                ? "bg-surface-elevated font-medium text-heading"
                : "text-foreground"
            }`}>
            <span>{label}</span>
            {count && <span className="text-foreground">{count}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function WideInboxMock({ className }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] ${className ?? ""}`}>
      <div className="flex h-full min-h-[140px]">
        <div className="w-28 shrink-0 border-r border-border bg-surface-elevated p-2">
          <div className="mb-2 h-2 w-16 rounded bg-border" />
          {["Inbox", "Drafts", "Sent"].map((item, i) => (
            <div
              key={item}
              className={`mb-1 rounded px-2 py-1 text-[9px] ${
                i === 0
                  ? "bg-surface font-medium text-heading shadow-sm"
                  : "text-foreground"
              }`}>
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-1">
          <div className="w-1/2 border-r border-border p-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="mb-2 border-b border-border/50 pb-2">
                <div className="h-2 w-3/4 rounded bg-border" />
                <div className="mt-1 h-1.5 w-full rounded bg-surface-elevated" />
              </div>
            ))}
          </div>
          <div className="flex-1 p-3">
            <div className="h-2 w-1/2 rounded bg-border" />
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 w-full rounded bg-surface-elevated" />
              <div className="h-1.5 w-full rounded bg-surface-elevated" />
              <div className="h-1.5 w-4/5 rounded bg-surface-elevated" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type SolutionCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

function SolutionCard({
  title,
  description,
  children,
  className,
}: SolutionCardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl bg-surface p-6 surface-card ${className ?? ""}`}>
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {description}
      </p>
      <div className="mt-auto pt-6">{children}</div>
    </article>
  );
}

export function SolutionsSection() {
  return (
    <section className="bg-surface-elevated py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Solution
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl">
            Empower Your Business with
            <br className="hidden 2xl:block" /> AI Workflows
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
            Generic AI tools won&apos;t suffice. Our platform is purpose-built
            to provide exceptional AI-driven solutions for your unique business
            needs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <SolutionCard
            title="Advanced AI Algorithms"
            description="Our platform utilizes cutting-edge AI algorithms to provide accurate and efficient solutions for your business needs."
            className="lg:col-start-1 lg:row-start-1">
            <DashboardMock className="mx-auto w-full max-w-[220px] opacity-60" />
          </SolutionCard>

          <SolutionCard
            title="Secure Data Handling"
            description="We prioritize your data security with state-of-the-art encryption and strict privacy protocols, ensuring your information remains confidential."
            className="lg:col-start-2 lg:row-start-1">
            <DashboardMock className="mx-auto w-full max-w-[220px] opacity-60" />
          </SolutionCard>

          <SolutionCard
            title="Seamless Integration"
            description="Easily integrate our AI solutions into your existing workflows and systems for a smooth and efficient operation."
            className="lg:col-start-3 lg:row-span-2 lg:row-start-1">
            <div className="relative flex min-h-[280px] items-end justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-size-[12px_12px] pt-8">
              <EmailSidebarMock className="w-[85%] translate-y-4" />
            </div>
          </SolutionCard>

          <SolutionCard
            title="Customizable Solutions"
            description="Tailor our AI services to your specific needs with flexible customization options, allowing you to get the most out of our platform."
            className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
            <WideInboxMock className="mx-auto w-full max-w-lg" />
          </SolutionCard>
        </div>
      </div>
    </section>
  );
}
