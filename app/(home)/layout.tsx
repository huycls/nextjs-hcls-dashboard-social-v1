import type { Metadata } from "next";
import { MarketingLayout } from "@/components/templates/marketing/marketing-layout";

export const metadata: Metadata = {
  title: "Avispark — Tự động hóa workflow",
  description:
    "Xây dựng, giám sát và mở rộng workflow tự động hóa trên một nền tảng",
};

export default function HomeRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
