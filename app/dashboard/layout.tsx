import type { Metadata } from "next";
import { AppShell } from "@/components/templates/dashboard/app-shell";

export const metadata: Metadata = {
  title: "Avispark — Dashboard",
  description: "Automation workflow dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
