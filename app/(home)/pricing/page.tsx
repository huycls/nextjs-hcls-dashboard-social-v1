import type { Metadata } from "next";
import { PricingTemplate } from "@/components/templates/pricing";

export const metadata: Metadata = {
  title: "Pricing — Avispark",
  description:
    "Simple, transparent pricing for teams of every size. Start free and scale as you grow.",
};

export default function PricingPage() {
  return <PricingTemplate />;
}
