"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { BorderBeam } from "@/components/atoms/BorderBeam";
import {
  CheckoutDialog,
  type CheckoutPlan,
} from "@/components/organisms/CheckoutDialog";
import type { BillingCycle } from "@/lib/payments/checkout";

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
    name: "Cơ bản",
    monthlyPrice: 19,
    yearlyPrice: 15,
    features: [
      "1 người dùng",
      "5GB lưu trữ",
      "Hỗ trợ cơ bản",
      "Truy cập API giới hạn",
      "Phân tích tiêu chuẩn",
    ],
    footer: "Phù hợp cho cá nhân và dự án nhỏ",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 39,
    popular: true,
    features: [
      "5 người dùng",
      "50GB lưu trữ",
      "Hỗ trợ ưu tiên",
      "Truy cập API đầy đủ",
      "Phân tích nâng cao",
    ],
    footer: "Lý tưởng cho doanh nghiệp và đội ngũ đang phát triển",
  },
  {
    id: "enterprise",
    name: "Doanh nghiệp",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      "Không giới hạn người dùng",
      "500GB lưu trữ",
      "Hỗ trợ premium 24/7",
      "Tích hợp tùy chỉnh",
      "Insight AI",
    ],
    footer: "Dành cho vận hành quy mô lớn và khối lượng cao",
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
          !isYearly ? "text-primary" : "text-foreground"
        }`}>
        Theo tháng
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isYearly}
        aria-label="Chuyển sang thanh toán theo năm"
        onClick={() => onChange(isYearly ? "monthly" : "yearly")}
        className={`cursor-pointer transition-all duration-300 ease-in-out relative shadow-sm top-0.5 bg-primary h-7 w-12 rounded-full ${
          isYearly ? "bg-primary" : "bg-surface"
        }`}>
        <span
          className={`absolute top-[3px] h-[22px] w-[22px] transition-all duration-300 ease-in-out rounded-full  shadow ${
            isYearly ? "left-6 bg-white" : "left-0.5 bg-[#525252]"
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium ${
          isYearly ? "text-primary" : "text-foreground"
        }`}>
        Theo năm
      </span>
    </div>
  );
}

function PricingCard({
  plan,
  billing,
  onSelect,
}: {
  plan: PricingPlan;
  billing: BillingCycle;
  onSelect: (plan: PricingPlan) => void;
}) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const billedLabel =
    billing === "monthly" ? "thanh toán theo tháng" : "thanh toán theo năm";

  return (
    <article
      className={`surface-card relative flex flex-col rounded-3xl bg-surface p-6 sm:p-8 ${
        plan.popular ? "surface-card-accent lg:scale-[1.02] !border-0" : ""
      }`}>
      {plan.popular && (
        <BorderBeam
          duration={8}
          size={300}
          borderWidth={2}
        />
      )}
      {plan.popular && (
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-background">
          <Star className="h-3 w-3 fill-background" />
          <span className="-mt-0.5">Phổ biến</span>
        </div>
      )}

      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {plan.name}
      </p>

      <div className="mt-4">
        <p className="flex items-end justify-center gap-1">
          <span className="text-4xl font-semibold tracking-tight text-heading">
            ${price}
          </span>
          <span className="mb-1 text-sm text-foreground">/ tháng</span>
        </p>
        <p className="mt-1 text-center text-xs text-foreground">
          {billedLabel}
        </p>
      </div>

      <ul className="mt-8 space-y-3 w-fit max-auto">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center justify-start gap-2 text-sm text-foreground">
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
        onClick={() => onSelect(plan)}
        className={`mt-8 h-11 w-full rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out ${
          plan.popular
            ? "bg-primary text-background hover:bg-primary-hover"
            : "surface-card bg-surface text-heading hover:bg-primary hover:text-background hover:shadow-[var(--shadow-card-hover)]"
        }`}>
        Đăng ký
      </button>

      <p className="mt-4 text-center text-xs text-foreground">{plan.footer}</p>
    </article>
  );
}

export function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlan | null>(null);

  function handleSelectPlan(plan: PricingPlan) {
    const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

    setSelectedPlan({
      id: plan.id,
      name: plan.name,
      price,
      compareAtPrice:
        billing === "yearly" && plan.yearlyPrice < plan.monthlyPrice
          ? plan.monthlyPrice
          : undefined,
      billing,
    });
  }

  return (
    <section className="bg-surface-elevated py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Bảng giá
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-heading sm:text-4xl lg:text-5xl leading-14">
            Chọn gói phù hợp
            <br className="hidden 2xl:block" /> theo nhu cầu
          </h2>

          <div className="mt-8">
            <BillingToggle
              billing={billing}
              onChange={setBilling}
            />
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-center lg:gap-8">
          {plans.map((plan) => {
            return (
              <PricingCard
                key={plan.id}
                plan={plan}
                billing={billing}
                onSelect={handleSelectPlan}
              />
            );
          })}
        </div>
      </div>

      <CheckoutDialog
        open={selectedPlan !== null}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </section>
  );
}
