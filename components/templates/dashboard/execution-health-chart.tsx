"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "Success", value: 86.3, color: "var(--node-green)" },
  { name: "Delayed", value: 8.5, color: "var(--node-orange)" },
  { name: "Failed", value: 5.2, color: "var(--error, var(--dpop-error-500))" },
];

export function ExecutionHealthChart() {
  return (
    <article className="surface-card rounded-2xl bg-surface-elevated p-5">
      <h2 className="mb-2 text-base font-semibold text-heading">
        Execution Health
      </h2>

      <div className="relative mx-auto h-[220px] w-full max-w-[240px]">
        <ResponsiveContainer
          width="100%"
          height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight text-heading">
            96.3%
          </span>
          <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-[var(--node-green)]">
            <TrendingUp className="h-3 w-3" />
            +2.1%
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted">{item.name}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
