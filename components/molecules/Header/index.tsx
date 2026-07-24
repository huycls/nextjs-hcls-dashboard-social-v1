"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BrandLogo } from "@/components/atoms/BrandLogo";
import { AnimatedThemeToggler } from "../../atoms/AnimatedThemeToggler";
import { ScrollProgress } from "../../atoms/ScrollProgress";
import ShinyText from "../../atoms/ShinyText";
import { useTheme } from "../../theme/theme-provider";
import { cn } from "@/lib/utils/tailwind-merge";

const menuEase = [0.22, 1, 0.36, 1] as const;

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: menuEase },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: menuEase },
  },
};

const mobileMenuItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.04 + index * 0.045,
      duration: 0.24,
      ease: menuEase,
    },
  }),
  exit: { opacity: 0, x: -8, transition: { duration: 0.12 } },
};

type NavDropdown = {
  label: string;
  items: { label: string; href: string; description?: string }[];
};

const navDropdowns: NavDropdown[] = [
  {
    label: "Tính năng",
    items: [
      {
        label: "Trình tạo workflow",
        href: "#",
        description: "Thiết kế tự động hóa trực quan",
      },
      {
        label: "Tích hợp",
        href: "#",
        description: "Kết nối các công cụ bạn dùng",
      },
      {
        label: "Phân tích",
        href: "#",
        description: "Theo dõi sức khỏe thực thi",
      },
    ],
  },
  {
    label: "Giải pháp",
    items: [
      {
        label: "Cho startup",
        href: "#",
        description: "Mở rộng vận hành mà không cần thêm nhân sự",
      },
      {
        label: "Cho doanh nghiệp",
        href: "#",
        description: "Tự động hóa an toàn, tuân thủ",
      },
      {
        label: "Cho developers",
        href: "#",
        description: "Nền tảng workflow ưu tiên API",
      },
    ],
  },
];

const navLinks = [
  { label: "Giới thiệu", href: "/about-us" },
  { label: "Bảng giá", href: "/pricing" },
  { label: "Blog", href: "/articles" },
] as const;

function NavDropdownMenu({ label, items }: NavDropdown) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:text-primary"
        aria-expanded={open}>
        {label}
        <ChevronDown
          className={cn("h-4 w-4 transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group block rounded-lg px-3 py-2.5 transition hover:bg-primary/10">
              <span className="text-sm font-medium text-heading transition-all duration-150 ease-in-out group-hover:text-primary">
                {item.label}
              </span>
              {item.description && (
                <span className="mt-0.5 block text-xs text-foreground">
                  {item.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavAccordion({
  label,
  items,
  onNavigate,
  itemIndex,
}: NavDropdown & { onNavigate: () => void; itemIndex: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      custom={itemIndex}
      variants={mobileMenuItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-heading"
        aria-expanded={open}>
        {label}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: menuEase }}
            className="overflow-hidden">
            <div className="space-y-1 px-3 pb-3">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2.5 transition hover:bg-primary/10">
                  <span className="text-sm font-medium text-heading">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 block text-xs text-muted">
                      {item.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function HomeNavbar() {
  const { isDark } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function handleViewportChange(event: MediaQueryListEvent | MediaQueryList) {
      if (event.matches) {
        setMobileOpen(false);
      }
    }

    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-lg">
      <ScrollProgress className="bottom-0 top-auto" />
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center">
          {/* <BrandLogo className="h-5 w-5 shrink-0" /> */}
          <img
            src="/assets/favicon.co"
            alt="Avispark"
            className={`h-16 w-16 shrink-0  ${isDark ? "mix-blend-luminosity" : "mix-blend-hard-light"}`}
          />
          <ShinyText
            text="Avispark"
            speed={2}
            delay={0}
            className="text-2xl font-bold"
            color={isDark ? "#ffffff" : "#333333"}
            shineColor={isDark ? "#f49e0b" : "#00a73e"}
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden items-center lg:flex">
            <Link
              href="/about-us"
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:text-primary">
              Giới thiệu
            </Link>
            {navDropdowns.map((dropdown) => (
              <NavDropdownMenu
                key={dropdown.label}
                {...dropdown}
              />
            ))}
            <Link
              href="/pricing"
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:text-primary">
              Bảng giá
            </Link>
            <Link
              href="/articles"
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:text-primary">
              Blog
            </Link>
          </nav>

          <div className="ml-2 flex items-center gap-2 sm:ml-4">
            <AnimatedThemeToggler
              variant="hexagon"
              duration={600}
              className="cursor-pointer hover:text-primary"
            />

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors duration-300 ease-in-out hover:bg-primary hover:text-background">
                Đăng nhập
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-background transition hover:bg-primary-hover">
                <BrandLogo
                  className="h-3.5 w-3.5 shrink-0"
                  variant="light"
                />
                <span className="hidden sm:inline">Bắt đầu miễn phí</span>
                <span className="sm:hidden">Bắt đầu</span>
              </Link>
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileOpen}
              aria-controls="home-mobile-nav"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border text-heading transition hover:bg-surface-elevated lg:hidden">
              <AnimatePresence
                mode="wait"
                initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: menuEase }}
                    className="inline-flex">
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    transition={{ duration: 0.2, ease: menuEase }}
                    className="inline-flex">
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Đóng menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 top-[72px] z-40 bg-black/40 lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.nav
              id="home-mobile-nav"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-x-0 top-[72px] z-50 max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-border bg-surface shadow-lg lg:hidden">
              {navLinks.slice(0, 1).map((link, index) => (
                <motion.div
                  key={link.href}
                  custom={index}
                  variants={mobileMenuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit">
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block border-b border-border px-4 py-3.5 text-sm font-medium text-heading transition hover:text-primary">
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {navDropdowns.map((dropdown, index) => (
                <MobileNavAccordion
                  key={dropdown.label}
                  {...dropdown}
                  itemIndex={index + 1}
                  onNavigate={closeMobileMenu}
                />
              ))}

              {navLinks.slice(1).map((link, index) => (
                <motion.div
                  key={link.href}
                  custom={index + navDropdowns.length + 1}
                  variants={mobileMenuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit">
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block border-b border-border px-4 py-3.5 text-sm font-medium text-heading transition hover:text-primary">
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                custom={navLinks.length + navDropdowns.length}
                variants={mobileMenuItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-2 p-4">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition hover:bg-primary hover:text-background">
                  Đăng nhập
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-background transition hover:bg-primary-hover">
                  <BrandLogo
                    className="h-3.5 w-3.5 shrink-0"
                    variant="light"
                  />
                  Bắt đầu miễn phí
                </Link>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
