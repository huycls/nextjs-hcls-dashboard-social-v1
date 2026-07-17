import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeHeadScript } from "@/components/theme/theme-script";
import {
  getThemeFromCookie,
  THEME_STORAGE_KEY,
} from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avispark",
  description: "Automation workflow platform",
  icons: {
    icon: "/assets/logo-avi.png",
    shortcut: "/assets/logo-avi.png",
    apple: "/assets/logo-avi.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = getThemeFromCookie(cookieStore.get(THEME_STORAGE_KEY)?.value);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className} h-full antialiased ${theme}`}
      data-theme={theme}
      suppressHydrationWarning>
      <head>
        <ThemeHeadScript />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
