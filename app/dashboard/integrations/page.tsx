import type { Metadata } from "next";
import { IntegrationsComingSoonPage } from "@/components/templates/dashboard/integrations-coming-soon-page";

export const metadata: Metadata = {
  title: "Avispark — Tích hợp",
  description: "Kết nối ứng dụng bên ngoài với không gian tự động hóa",
};

export default function IntegrationsPage() {
  return <IntegrationsComingSoonPage />;
}
