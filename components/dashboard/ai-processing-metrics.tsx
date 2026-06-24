type Metric = {
  label: string;
  value: number;
};

const metrics: Metric[] = [
  { label: "Automation Success Rate", value: 94 },
  { label: "Document Processing", value: 87 },
  { label: "Webhook Delivery Rate", value: 72 },
];

export function AiProcessingMetrics() {
  return (
    <section className="surface-card rounded-xl bg-surface p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-heading">
          AI Processing Metrics
        </h2>
        <p className="mt-1 text-sm text-[#333333]d">
          Real-time insights into automated workflows
        </p>
      </div>

      <ul className="space-y-5">
        {metrics.map(({ label, value }) => (
          <li key={label}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-heading">{label}</span>
              <span className="text-sm font-semibold text-heading">
                {value}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${value}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
