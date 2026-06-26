import { HomeFooter } from "@/components/molecules/Footer";
import { HomeNavbar } from "@/components/molecules/Header";

export function MarketingLayout({
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
