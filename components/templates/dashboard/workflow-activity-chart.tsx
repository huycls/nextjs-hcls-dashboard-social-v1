"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "S", value: 420 },
  { day: "M", value: 680 },
  { day: "T", value: 540 },
  { day: "W", value: 890 },
  { day: "T", value: 950 },
  { day: "F", value: 720 },
  { day: "S", value: 610 },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="surface-card rounded-xl bg-surface-elevated px-3 py-2">
      <p className="text-xs font-medium text-muted">CRM</p>
      <p className="text-sm font-semibold text-heading">
        ${payload[0].value.toLocaleString()}
      </p>
      <p className="text-xs font-medium text-[var(--node-green)]">+125%</p>
    </div>
  );
}

export function WorkflowActivityChart() {
  return (
    <article className="surface-card rounded-2xl bg-surface-elevated p-5 xl:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-heading">
          Workflow Activity Trend
        </h2>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient
                id="activityFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--node-blue)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--node-blue)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              hide
              domain={[0, 1000]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--border)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--node-blue)"
              strokeWidth={2}
              fill="url(#activityFill)"
              dot={false}
              activeDot={{ r: 5, fill: "var(--node-blue)", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
