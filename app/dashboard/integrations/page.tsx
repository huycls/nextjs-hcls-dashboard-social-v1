import type { Metadata } from "next";
import { IntegrationsComingSoonPage } from "@/components/templates/dashboard/integrations-coming-soon-page";

export const metadata: Metadata = {
  title: "Avispark — Integrations",
  description: "Connect external apps to your automation workspace",
};

export default function IntegrationsPage() {
  return <IntegrationsComingSoonPage />;
}
