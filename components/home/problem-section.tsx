import type { LucideIcon } from "lucide-react";
import { Brain, Shield, Zap } from "lucide-react";

type ProblemItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const problems: ProblemItem[] = [
  {
    icon: Brain,
    title: "Data Overload",
    description:
      "Businesses struggle to make sense of vast amounts of complex data, missing out on valuable insights that could drive growth and innovation.",
  },
  {
    icon: Zap,
    title: "Slow Decision-Making",
    description:
      "Traditional data processing methods are too slow, causing businesses to lag behind market changes and miss crucial opportunities.",
  },
  {
    icon: Shield,
    title: "Data Security Concerns",
    description:
      "With increasing cyber threats, businesses worry about the safety of their sensitive information when adopting new technologies.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Problem
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl">
            Manually entering your data is a hassle.
          </h2>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 lg:mx-0">
                <Icon
                  className="h-5 w-5 text-primary"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-lg font-semibold text-heading">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#333333]d">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
