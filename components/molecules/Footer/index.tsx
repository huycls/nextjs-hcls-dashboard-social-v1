"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { BrandLogo } from "@/components/atoms/BrandLogo";
import {
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/organisms/SocialIcons";
import ShinyText from "@/components/atoms/ShinyText";
import { useTheme } from "@/components/theme/theme-provider";

type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

type FooterLink = {
  label: string;
  href: string;
};

type FooterLinks = {
  product: FooterLink[];
  company: FooterLink[];
  resources: FooterLink[];
  social: SocialLink[];
};

const footerLinks: FooterLinks = {
  product: [
    { label: "Tính năng", href: "#" },
    { label: "Bảng giá", href: "/pricing" },
    { label: "Tài liệu", href: "#" },
    { label: "API", href: "#" },
  ],
  company: [
    { label: "Giới thiệu", href: "/about-us" },
    { label: "Tuyển dụng", href: "#" },
    { label: "Blog", href: "/articles" },
    { label: "Báo chí", href: "#" },
    { label: "Đối tác", href: "#" },
  ],
  resources: [
    { label: "Cộng đồng", href: "#" },
    { label: "Liên hệ", href: "#" },
    { label: "Hỗ trợ", href: "#" },
    { label: "Trạng thái", href: "#" },
  ],
  social: [
    { label: "Twitter", href: "#", icon: TwitterIcon },
    { label: "Instagram", href: "#", icon: InstagramIcon },
    { label: "Youtube", href: "#", icon: YoutubeIcon },
  ],
};

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-heading">{title}</h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

export function HomeFooter() {
  const year = new Date().getFullYear();
  const { isDark } = useTheme();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5">
          <BrandLogo className="h-5 w-5 shrink-0" />
          {/* <span className="text-2xl font-bold tracking-tight text-heading">
            Avispark
          </span> */}
          <ShinyText
            text="Avispark"
            speed={2}
            delay={0}
            className="text-xl font-bold"
            color={isDark ? "#ffffff" : "#333333"}
            shineColor={isDark ? "#f49e0b" : "#00a73e"}
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </Link>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          <FooterColumn title="Sản phẩm">
            {footerLinks.product.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-base text-foreground transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {footerLinks.company.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-base text-foreground transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Tài nguyên">
            {footerLinks.resources.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-base text-foreground transition hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Mạng xã hội">
            {footerLinks.social.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-base text-foreground transition hover:text-primary">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-base text-foreground">
            Bản quyền © {year} Avispark — Tự động hóa workflow với AI
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-base text-foreground transition hover:text-primary">
              Chính sách bảo mật
            </Link>
            <Link
              href="#"
              className="text-base text-foreground transition hover:text-primary">
              Điều khoản dịch vụ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
