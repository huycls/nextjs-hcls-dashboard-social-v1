import type { Metadata } from "next";
import { PricingTemplate } from "@/components/templates/pricing";

export const metadata: Metadata = {
  title: "Bảng giá — Avispark",
  description:
    "Bảng giá đơn giản, minh bạch cho mọi quy mô đội ngũ. Bắt đầu miễn phí và mở rộng khi bạn phát triển.",
};

export default function PricingPage() {
  return <PricingTemplate />;
}
