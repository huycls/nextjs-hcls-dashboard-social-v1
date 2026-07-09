import Link from "next/link";
import { ArrowRight, Heart, Lightbulb, Shield, Users, Zap } from "lucide-react";
import { MarketingPageHeader } from "@/components/organisms/AboutusContent/marketing-page-header";
import CountUp from "@/components/atoms/CountUp";

const stats = [
  { value: 10, suffix: "K+", label: "Workflows automated" },
  { value: 500, suffix: "+", label: "Teams worldwide" },
  { value: 99.9, suffix: "%", label: "Uptime SLA" },
  { value: 24, suffix: "/7", label: "Enterprise support" },
];

const values = [
  {
    icon: Zap,
    title: "Move fast, ship reliably",
    description:
      "We believe automation should accelerate teams — not add complexity. Every feature we build is tested for real-world reliability.",
  },
  {
    icon: Users,
    title: "Built for every team",
    description:
      "From solo founders to enterprise ops, Avispark scales with you. No-code for starters, full API control for power users.",
  },
  {
    icon: Shield,
    title: "Security by default",
    description:
      "Your data and workflows are protected with encryption at rest and in transit, role-based access, and audit logs.",
  },
  {
    icon: Lightbulb,
    title: "AI that works for you",
    description:
      "We integrate leading AI models into practical workflow nodes — classification, extraction, summarization, and more.",
  },
  {
    icon: Heart,
    title: "Customer-obsessed",
    description:
      "Our roadmap is shaped by real user feedback. We ship improvements weekly and listen to every support conversation.",
  },
];

export function AboutUsContent() {
  return (
    <>
      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MarketingPageHeader
            eyebrow="About us"
            title="We help teams automate what matters"
            description="Avispark was founded with a simple mission: make workflow automation accessible, powerful, and trustworthy for every team — from startups to enterprises."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const number = stat.value.toString().split(".")[0];
              const suffix = stat.suffix;
              return (
                <div
                  key={stat.label}
                  className="surface-card rounded-2xl bg-surface p-6 text-center">
                  <div className="text-3xl font-bold tracking-tight text-primary">
                    <CountUp
                      from={0}
                      to={Number(number)}
                    />
                    {suffix}
                  </div>
                  <p className="mt-2 text-sm text-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-elevated py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our story
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl">
              Born from frustration with manual work
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground sm:text-lg">
              Our founders spent years watching talented teams drown in
              repetitive tasks — copying data between tools, triggering alerts
              manually, and waiting on engineering for every small automation.
              Avispark started as an internal tool and grew into a platform used
              by hundreds of teams to reclaim their time and focus on
              high-impact work.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our values
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl">
              What drives us every day
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="surface-card rounded-2xl bg-surface p-6 sm:p-8">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-heading">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-elevated py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-semibold text-heading sm:text-4xl">
            Ready to automate your workflows?
          </h2>
          <p className="mt-4 text-base text-foreground sm:text-lg">
            Join hundreds of teams already using Avispark to build smarter,
            faster automations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-background transition hover:bg-primary-hover">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center rounded-xl border border-border bg-surface px-6 text-sm font-medium text-heading transition hover:bg-surface-elevated">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
