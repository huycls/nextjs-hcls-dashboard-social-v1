import {
  Activity,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type KpiCard = {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  iconClass: string;
};

const cards: KpiCard[] = [
  {
    title: "Workflows Run Today",
    value: "147",
    trend: "+12%",
    trendUp: true,
    icon: Activity,
    iconClass: "bg-[var(--node-blue-bg)] text-[var(--node-blue)]",
  },
  {
    title: "Automations Approved",
    value: "89",
    trend: "+23%",
    trendUp: true,
    icon: CheckCircle2,
    iconClass: "bg-[var(--node-green-bg)] text-[var(--node-green)]",
  },
  {
    title: "Avg Processing Time",
    value: "2.3 hrs",
    trend: "-45%",
    trendUp: true,
    icon: Clock,
    iconClass: "bg-[var(--node-orange-bg)] text-[var(--node-orange)]",
  },
  {
    title: "Cost Saved",
    value: "$12,540",
    trend: "+18%",
    trendUp: true,
    icon: DollarSign,
    iconClass: "bg-[var(--node-green-bg)] text-[var(--node-green)]",
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, trend, trendUp, icon: Icon, iconClass }) => (
        <article
          key={title}
          className="surface-card rounded-xl bg-surface p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted">{title}</p>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <p className="text-3xl font-semibold tracking-tight text-heading">
              {value}
            </p>
            <span
              className={`mb-1 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
                trendUp
                  ? "bg-[var(--node-green-bg)] text-[var(--node-green)]"
                  : "bg-[var(--node-orange-bg)] text-[var(--node-orange)]"
              }`}>
              {trendUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
