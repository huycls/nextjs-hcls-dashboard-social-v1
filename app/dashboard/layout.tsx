import type { Metadata } from "next";
import { AppShell } from "@/components/dashboard/app-shell";

export const metadata: Metadata = {
  title: "Flowaxon — Dashboard",
  description: "Automation workflow dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
