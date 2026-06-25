type MarketingPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function MarketingPageHeader({
  eyebrow,
  title,
  description,
}: MarketingPageHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-heading sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
