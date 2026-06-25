type BrandLogoProps = {
  className?: string;
  variant?: "dark" | "light" | "primary";
};

export function BrandLogo({ className, variant = "dark" }: BrandLogoProps) {
  const colorClass =
    variant === "light"
      ? "text-background"
      : variant === "primary"
        ? "text-primary"
        : "text-heading";

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`${colorClass} ${className ?? ""}`}
    >
      <rect x="1" y="9" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="9" y="9" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="11" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}
