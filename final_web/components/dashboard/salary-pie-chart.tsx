"use client";

import type { SalaryTierDatum } from "@/lib/dashboard-data";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#60a5fa",
  "#7bb8ff",
  "#93c5fd",
  "#bfdbfe",
  "#dbeafe",
  "#eff6ff",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: SalaryTierDatum;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-xl">
        <p className="font-semibold text-foreground">{data.range}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          实习岗位数量：<span className="font-medium text-accent">{data.value}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          占比：
          <span className="font-medium text-chart-3">{data.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function SalaryPieChart({ data }: { data: SalaryTierDatum[] }) {
  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            label={({ percentage }) => `${percentage}%`}
            labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-4">
        {data.map((item, index) => (
          <div key={item.range} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-muted-foreground">
              {item.range}{" "}
              <span className="font-medium text-foreground">
                {item.percentage}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
