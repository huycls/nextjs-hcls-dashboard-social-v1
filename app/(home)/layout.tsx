import type { Metadata } from "next";
import { HomeFooter } from "@/components/molecules/Footer";
import { HomeNavbar } from "@/components/molecules/Header";

export const metadata: Metadata = {
  title: "Avispark — Automate your workflows",
  description: "Build, monitor, and scale automation workflows in one place",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <HomeNavbar />

      <main className="flex-1">{children}</main>

      <HomeFooter />
    </div>
  );
}
