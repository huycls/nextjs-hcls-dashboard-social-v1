import type { Metadata } from "next";
import { MarketingLayout } from "@/components/templates/marketing/marketing-layout";

export const metadata: Metadata = {
  title: "Avispark — Automate your workflows",
  description: "Build, monitor, and scale automation workflows in one place",
};

export default function HomeRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
