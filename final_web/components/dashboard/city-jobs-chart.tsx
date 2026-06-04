"use client";

import type { CityJobDatum } from "@/lib/dashboard-data";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CityJobDatum;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-xl">
        <p className="font-semibold text-foreground">{data.city}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          岗位数量：<span className="font-medium text-accent">{data.jobs}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          平均薪资：<span className="font-medium text-chart-3">{data.salary}k</span>
        </p>
      </div>
    );
  }
  return null;
};

export function CityJobsChart({ data }: { data: CityJobDatum[] }) {
  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 76, left: 0, bottom: 28 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString("zh-CN")}
          />
          <YAxis
            type="category"
            dataKey="city"
            width={50}
            tick={{ fontSize: 13, fill: "var(--foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--secondary)", opacity: 0.5 }}
          />
          <Bar dataKey="jobs" radius={[0, 6, 6, 0]}>
            <LabelList
              dataKey="jobs"
              position="right"
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => value.toLocaleString("zh-CN")}
            />
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index < 3 ? "var(--accent)" : "var(--chart-2)"}
                fillOpacity={Math.max(0.3, 1 - index * 0.07)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
