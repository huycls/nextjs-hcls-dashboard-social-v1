import metricsData from "@/common/data/metrics.json";

type MetricItem = {
  id: string;
  label: string;
  value: number;
  unit: string;
};

type MetricsData = {
  title: string;
  description: string;
  updatedAt: string;
  metrics: MetricItem[];
};

const { title, description, metrics } = metricsData as MetricsData;

export function AiProcessingMetrics() {
  return (
    <section className="surface-card rounded-xl bg-surface p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-heading">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <ul className="space-y-5">
        {metrics.map(({ id, label, value, unit }) => (
          <li key={id}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-heading">{label}</span>
              <span className="text-sm font-semibold text-heading">
                {value}
                {unit}
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
