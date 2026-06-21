import {
  Activity,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type KpiCard = {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  subtitle: string;
  icon: LucideIcon;
};

const cards: KpiCard[] = [
  {
    title: "Active Workflows",
    value: "23",
    trend: "+12%",
    trendUp: true,
    subtitle: "+7 from last month",
    icon: Workflow,
  },
  {
    title: "Automation Triggered",
    value: "1,205",
    trend: "+12%",
    trendUp: true,
    subtitle: "+107 from last month",
    icon: Activity,
  },
  {
    title: "Avg Execution Time",
    value: "3.4s",
    trend: "-12%",
    trendUp: false,
    subtitle: "-0.5s from last month",
    icon: Clock,
  },
  {
    title: "Success Rate",
    value: "98.5%",
    trend: "+4%",
    trendUp: true,
    subtitle: "+9.6% from last month",
    icon: CheckCircle2,
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        ({ title, value, trend, trendUp, subtitle, icon: Icon }) => (
          <article
            key={title}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <p className="text-3xl font-semibold tracking-tight text-gray-900">
                {value}
              </p>
              <span
                className={`mb-1 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                  trendUp
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-500"
                }`}
              >
                {trendUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {trend}
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-400">{subtitle}</p>
          </article>
        ),
      )}
    </div>
  );
}
