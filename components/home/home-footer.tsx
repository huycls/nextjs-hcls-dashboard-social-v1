import Link from "next/link";
import type { ComponentType } from "react";
import { BrandLogo } from "@/components/home/brand-logo";
import {
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/home/social-icons";

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
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "API", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
    { label: "Partners", href: "#" },
  ],
  resources: [
    { label: "Community", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Support", href: "#" },
    { label: "Status", href: "#" },
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
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

export function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <BrandLogo className="h-5 w-5 shrink-0" />
          <span className="text-lg font-bold tracking-tight text-heading">
            Avispark
          </span>
        </Link>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-12">
          <FooterColumn title="Product">
            {footerLinks.product.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#333333]d transition hover:text-heading">
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
                  className="text-sm text-[#333333]d transition hover:text-heading">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Resources">
            {footerLinks.resources.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#333333]d transition hover:text-heading">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Social">
            {footerLinks.social.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-sm text-[#333333]d transition hover:text-heading">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-[#333333]d">
            Copyright © {year} Avispark — Automate your workflow with AI
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-[#333333]d transition hover:text-heading">
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-[#333333]d transition hover:text-heading">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
