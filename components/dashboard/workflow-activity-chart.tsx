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
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-900">CRM</p>
      <p className="text-sm font-semibold text-gray-900">
        ${payload[0].value.toLocaleString()}
      </p>
      <p className="text-xs font-medium text-emerald-600">+125%</p>
    </div>
  );
}

export function WorkflowActivityChart() {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Workflow Activity Trend
        </h2>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9CA3AF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={8}
            />
            <YAxis hide domain={[0, 1000]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#D1D5DB" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6B7280"
              strokeWidth={2}
              fill="url(#activityFill)"
              dot={false}
              activeDot={{ r: 5, fill: "#111827", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
