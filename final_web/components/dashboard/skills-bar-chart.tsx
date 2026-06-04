"use client";

import type { SkillDatum } from "@/lib/dashboard-data";
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

const getBarColor = (index: number) => {
  const palette = [
    "#65a30d",
    "#84cc16",
    "#a3e635",
    "#bef264",
    "#d9f99d",
    "#ecfccb",
  ];
  return palette[index % palette.length];
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: SkillDatum;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-xl">
        <p className="font-semibold text-foreground">{data.skill}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          出现频次：<span className="font-medium text-accent">{data.count}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function SkillsBarChart({ data }: { data: SkillDatum[] }) {
  return (
    <div className="h-[480px]">
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
            dataKey="skill"
            width={80}
            tick={{ fontSize: 13, fill: "var(--foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--secondary)", opacity: 0.5 }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            <LabelList
              dataKey="count"
              position="right"
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => value.toLocaleString("zh-CN")}
            />
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(index)}
                fillOpacity={Math.max(0.35, 1 - index * 0.04)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
