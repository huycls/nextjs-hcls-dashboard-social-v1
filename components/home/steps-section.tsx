import type { LucideIcon } from "lucide-react";
import { Sparkles, Upload, Zap } from "lucide-react";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: Upload,
    title: "1. Upload Your Data",
    description:
      "Simply upload your data to our secure platform. We support various file formats and data types to ensure a seamless integration with your existing systems.",
  },
  {
    icon: Zap,
    title: "2. Click Start",
    description:
      "Our advanced AI algorithms automatically process and analyze your data, extracting valuable insights and patterns that would be difficult to identify manually.",
  },
  {
    icon: Sparkles,
    title: "3. Get Actionable Insights",
    description:
      "Receive clear, actionable insights and recommendations based on the AI analysis. Use these insights to make data-driven decisions and improve your business strategies.",
  },
];

function StepsDashboardMock() {
  const messages = [
    { name: "William Smith", preview: "Meeting Tomorrow", active: true },
    { name: "Alice Smith", preview: "Re: Project Update", active: false },
    { name: "Robert Johnson", preview: "Weekend Plans", active: false },
    {
      name: "Emily Davis",
      preview: "Re: Question about Budget",
      active: false,
    },
  ];

  const navItems = ["Inbox", "Drafts", "Sent", "Junk", "Trash", "Archive"];

  return (
    <div className="surface-card overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-card-hover)]">
      <div className="flex min-h-[380px]">
        <aside className="w-36 shrink-0 bg-background p-3 text-heading">
          <p className="mb-4 text-[10px] font-semibold">Alicia Koch</p>
          <nav className="space-y-0.5">
            {navItems.map((item, i) => (
              <div
                key={item}
                className={`rounded-md px-2 py-1.5 text-[9px] ${
                  i === 0
                    ? "bg-surface-elevated font-medium"
                    : "text-[#333333]d"
                }`}>
                {item}
              </div>
            ))}
          </nav>
          <p className="mb-1 mt-4 text-[8px] font-medium uppercase tracking-wider text-[#333333]d">
            Categories
          </p>
          {["Social", "Updates", "Forums"].map((cat) => (
            <div
              key={cat}
              className="px-2 py-1 text-[9px] text-[#333333]d">
              {cat}
            </div>
          ))}
        </aside>

        <div className="flex flex-1 border-r border-border">
          <div className="w-[42%] border-r border-border p-2">
            <p className="mb-2 text-[10px] font-semibold text-heading">Inbox</p>
            {messages.map((msg) => (
              <div
                key={msg.name}
                className={`mb-1 rounded-lg px-2 py-2 ${
                  msg.active ? "bg-surface-elevated" : ""
                }`}>
                <p className="text-[9px] font-medium text-heading">
                  {msg.name}
                </p>
                <p className="truncate text-[8px] text-[#333333]d">
                  {msg.preview}
                </p>
              </div>
            ))}
          </div>

          <div className="flex-1 p-4">
            <p className="text-xs font-semibold text-heading">
              Meeting Tomorrow
            </p>
            <p className="mt-1 text-[9px] text-[#333333]d">
              William Smith &lt;william@example.com&gt;
            </p>
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded bg-surface-elevated" />
              <div className="h-2 w-full rounded bg-surface-elevated" />
              <div className="h-2 w-4/5 rounded bg-surface-elevated" />
              <div className="h-2 w-full rounded bg-surface-elevated" />
              <div className="h-2 w-3/5 rounded bg-surface-elevated" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepsSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl">
            Just 3 steps to get started
          </h2>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ol className="relative space-y-10">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className="relative flex gap-5">
                {index < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-14 h-[calc(100%+0.5rem)] w-px bg-border"
                  />
                )}

                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <Icon
                    className="h-5 w-5 text-primary"
                    strokeWidth={1.75}
                  />
                </div>

                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-heading">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#333333]d">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="lg:pl-4">
            <StepsDashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}
