import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/templates/dashboard/app-shell";
import { getAuthToken } from "@/lib/auth/auth-server";

export const metadata: Metadata = {
  title: "Avispark — Tổng quan",
  description: "Bảng điều khiển workflow tự động hóa",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getAuthToken();

  if (!token) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") ?? "/dashboard";
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return <AppShell>{children}</AppShell>;
}
