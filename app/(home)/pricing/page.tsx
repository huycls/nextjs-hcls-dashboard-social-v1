import type { Metadata } from "next";
import { FaqSection } from "@/components/home/faq-section";
import { PricingSection } from "@/components/home/pricing-section";

export const metadata: Metadata = {
  title: "Pricing — Avispark",
  description:
    "Simple, transparent pricing for teams of every size. Start free and scale as you grow.",
};

export default function PricingPage() {
  return (
    <>
      <PricingSection />
      <FaqSection />
    </>
  );
}
