"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";

type BillingCycle = "monthly" | "yearly";

type PricingPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  footer: string;
  popular?: boolean;
};

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 19,
    yearlyPrice: 15,
    features: [
      "1 User",
      "5GB Storage",
      "Basic Support",
      "Limited API Access",
      "Standard Analytics",
    ],
    footer: "Perfect for individuals and small projects",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 39,
    popular: true,
    features: [
      "5 Users",
      "50GB Storage",
      "Priority Support",
      "Full API Access",
      "Advanced Analytics",
    ],
    footer: "Ideal for growing businesses and teams",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      "Unlimited Users",
      "500GB Storage",
      "24/7 Premium Support",
      "Custom Integrations",
      "AI-Powered Insights",
    ],
    footer: "For large-scale operations and high-volume users",
  },
];

function BillingToggle({
  billing,
  onChange,
}: {
  billing: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  const isYearly = billing === "yearly";

  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={`text-sm font-medium ${
          !isYearly ? "text-heading" : "text-[#333333]d"
        }`}>
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isYearly}
        aria-label="Toggle yearly billing"
        onClick={() => onChange(isYearly ? "monthly" : "yearly")}
        className={`relative h-7 w-12 rounded-full transition ${
          isYearly ? "bg-primary" : "bg-surface-elevated"
        }`}>
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-heading shadow transition ${
            isYearly ? "left-5" : "left-0.5"
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium ${
          isYearly ? "text-heading" : "text-[#333333]d"
        }`}>
        Yearly
      </span>
    </div>
  );
}

function PricingCard({
  plan,
  billing,
}: {
  plan: PricingPlan;
  billing: BillingCycle;
}) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const billedLabel =
    billing === "monthly" ? "billed monthly" : "billed yearly";

  return (
    <article
      className={`surface-card relative flex flex-col rounded-3xl bg-surface p-6 sm:p-8 ${
        plan.popular ? "surface-card-accent lg:scale-[1.02]" : ""
      }`}>
      {plan.popular && (
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-background">
          <Star className="h-3 w-3 fill-background" />
          Popular
        </div>
      )}

      <p className="text-xs font-semibold uppercase tracking-wider text-[#333333]d">
        {plan.name}
      </p>

      <div className="mt-4">
        <p className="flex items-end justify-center gap-1">
          <span className="text-4xl font-semibold tracking-tight text-heading">
            ${price}
          </span>
          <span className="mb-1 text-sm text-[#333333]d">/ month</span>
        </p>
        <p className="mt-1 text-center text-xs text-[#333333]d">
          {billedLabel}
        </p>
      </div>

      <ul className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center justify-center gap-2 text-sm text-foreground">
            <Check
              className="h-4 w-4 shrink-0 text-primary"
              strokeWidth={2.5}
            />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`mt-8 h-11 w-full rounded-xl text-sm font-medium transition ${
          plan.popular
            ? "bg-primary text-background hover:bg-primary-hover"
            : "surface-card bg-surface text-heading hover:bg-surface-elevated hover:shadow-[var(--shadow-card-hover)]"
        }`}>
        Subscribe
      </button>

      <p className="mt-4 text-center text-xs text-[#333333]d">{plan.footer}</p>
    </article>
  );
}

export function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section className="bg-surface-elevated py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-heading sm:text-4xl lg:text-5xl">
            Choose the plan that&apos;s right for you
          </h2>

          <div className="mt-8">
            <BillingToggle
              billing={billing}
              onChange={setBilling}
            />
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-center lg:gap-8">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billing={billing}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
