import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RotatingText from "../atoms/RotatingText";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#333333]d text-primary">
          Automation platform
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-heading sm:text-5xl lg:text-6xl">
          Automate workflows.
          <br />
          <span className="text-[#333333]d justify-start items-center mt-3 inline-flex">
            Work
            <RotatingText
              texts={["smarter.", "Faster"]}
              mainClassName="px-2 ml-4 sm:px-2 md:px-3 bg-primary text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3000}
              splitBy="characters"
              auto
              loop
            />
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-foreground">
          Avispark helps teams build, deploy, and monitor automation workflows —
          from simple triggers to complex multi-step pipelines.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-background transition hover:bg-primary-hover">
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center rounded-xl border border-border bg-surface px-6 text-sm font-medium text-heading transition hover:bg-surface-elevated">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
