import { Info } from "lucide-react";
import metricsData from "@/common/data/metrics.json";

type MetricItem = {
  id: string;
  label: string;
  value: number;
  unit: string;
  tooltip: string;
};

type MetricsData = {
  title: string;
  description: string;
  updatedAt: string;
  metrics: MetricItem[];
};

const { title, description, metrics } = metricsData as MetricsData;

const SIZE = 112;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const RING_TONES = [
  "var(--primary)",
  "var(--node-blue)",
  "var(--node-orange)",
  "var(--node-green)",
  "var(--primary)",
] as const;

function CircularProgress({
  value,
  unit,
  color,
}: {
  value: number;
  unit: string;
  color: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
        aria-hidden>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold tabular-nums text-heading">
          {value}
          <span className="text-sm ml-0.5 font-medium text-heading">
            {unit}
          </span>
        </span>
      </span>
    </div>
  );
}

function MetricTooltip({ label, text }: { label: string; text: string }) {
  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={`Giới thiệu về ${label}`}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted transition hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
        <Info
          className="h-3.5 w-3.5"
          strokeWidth={2}
        />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-xl border border-border bg-surface-elevated px-3 py-2 text-left text-xs leading-5 text-foreground opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
        {text}
        <span
          aria-hidden
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border bg-surface-elevated"
        />
      </span>
    </span>
  );
}

export function AiProcessingMetrics() {
  return (
    <section className="surface-card rounded-xl bg-surface p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-heading">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map(({ id, label, value, unit, tooltip }, index) => (
          <li
            key={id}
            className="flex flex-col items-center gap-3 text-center">
            <CircularProgress
              value={value}
              unit={unit}
              color={RING_TONES[index % RING_TONES.length]!}
            />
            <span className="flex max-w-[10.5rem] items-center justify-center gap-1.5 text-[12px] font-medium leading-5 text-heading">
              <span className="inline">
                {label}{" "}
                <MetricTooltip
                  label={label}
                  text={tooltip}
                />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
