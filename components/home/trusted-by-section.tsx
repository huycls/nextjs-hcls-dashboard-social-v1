const brands = [
  "YouTube",
  "Instagram",
  "Uber",
  "Spotify",
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
];

export function TrustedBySection() {
  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#333333]d">
          Trusted by leading teams
        </p>

        <div className="relative overflow-hidden">
          <div className="flex items-center justify-center gap-x-10 gap-y-6 overflow-x-auto px-2 [scrollbar-width:none] sm:gap-x-14 [&::-webkit-scrollbar]:hidden">
            {brands.map((brand) => (
              <span
                key={brand}
                className="shrink-0 text-lg font-semibold tracking-tight text-[#333333]d select-none">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
