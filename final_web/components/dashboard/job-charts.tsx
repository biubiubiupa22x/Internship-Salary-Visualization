"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import type { CityJobStructureDatum, JobBubbleDatum, JobDemandDatum, JobSalaryDatum } from "@/lib/job-data";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const STACK_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#a855f7",
  "#f97316",
  "#84cc16",
  "#0ea5e9",
];
const EDUCATION_COLOR_STOPS = [
  { value: 0, color: "#6d28d9" },
  { value: 0.35, color: "#e879f9" },
  { value: 0.7, color: "#fdba74" },
  { value: 1, color: "#fef08a" },
];

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function interpolateHex(from: string, to: string, ratio: number) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  const mix = (a: number, b: number) => Math.round(a + (b - a) * ratio);
  return `rgb(${mix(start.r, end.r)}, ${mix(start.g, end.g)}, ${mix(start.b, end.b)})`;
}

function educationColor(score: number) {
  const min = 1.5;
  const max = 2.1;
  const t = Math.min(1, Math.max(0, (score - min) / (max - min)));
  const upperIndex = EDUCATION_COLOR_STOPS.findIndex((stop) => t <= stop.value);
  const upper = EDUCATION_COLOR_STOPS[Math.max(upperIndex, 1)];
  const lower = EDUCATION_COLOR_STOPS[Math.max(upperIndex - 1, 0)];
  const localRatio = (t - lower.value) / (upper.value - lower.value || 1);
  return interpolateHex(lower.color, upper.color, localRatio);
}

export function JobDemandChart({ data }: { data: JobDemandDatum[] }) {
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 54 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="type" width={110} tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value} 个实习岗位`, "实习需求量"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="count" position="right" className="fill-foreground" fontSize={12} />
            {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function JobSalaryChart({ data }: { data: JobSalaryDatum[] }) {
  const width = 560;
  const height = 320;
  const margin = { top: 20, right: 64, bottom: 30, left: 112 };
  const plotWidth = width - margin.left - margin.right;
  const rowHeight = (height - margin.top - margin.bottom) / data.length;
  const domainMax = Math.ceil(Math.max(...data.map((item) => item.salary), 1) / 2) * 2 + 1;
  const x = (value: number) => margin.left + (value / domainMax) * plotWidth;
  const ticks = Array.from({ length: 6 }, (_, index) => Number(((domainMax / 5) * index).toFixed(1)));

  return (
    <div className="h-[320px]">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" className="h-full w-full overflow-visible">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={margin.top} y2={height - margin.bottom} stroke="var(--border)" strokeDasharray="3 4" />
            <text x={x(tick)} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">{tick}k</text>
          </g>
        ))}
        {data.map((item, index) => {
          const y = margin.top + index * rowHeight + rowHeight / 2;
          const color = item.salary >= 30 ? "#8b5cf6" : item.salary >= 22 ? "#a78bfa" : "#c4b5fd";

          return (
            <g key={item.type} className="cursor-pointer">
              <title>{`${item.type}：平均实习薪资 ${item.salary}k`}</title>
              <text x={margin.left - 12} y={y + 4} textAnchor="end" className="fill-foreground text-[12px]">{item.type}</text>
              <line x1={margin.left} x2={x(item.salary)} y1={y} y2={y} stroke={color} strokeWidth={3} strokeLinecap="round" strokeOpacity={0.65} />
              <circle cx={x(item.salary)} cy={y} r={7} fill={color} stroke="var(--card)" strokeWidth={2} />
              <text x={x(item.salary) + 12} y={y + 4} className="fill-foreground text-[12px] font-medium">{item.salary}k</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BubbleTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: JobBubbleDatum }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{item.name}</p>
      <p className="mt-1 text-muted-foreground">岗位数量：{item.count} 个</p>
      <p className="text-muted-foreground">平均实习薪资：{item.salary}k</p>
      <p className="text-muted-foreground">平均学历门槛：{item.educationScore}</p>
    </div>
  );
}

export function JobBubbleChart({ data }: { data: JobBubbleDatum[] }) {
  const displayData = data.map((item) => ({ ...item, bubbleSize: item.count }));
  const maxCount = Math.max(...data.map((item) => item.count), 1);
  const minSalary = Math.max(0, Math.floor((Math.min(...data.map((item) => item.salary), 0) - 0.2) * 10) / 10);
  const maxSalary = Math.ceil(Math.max(...data.map((item) => item.salary), 1) + 0.2);

  return (
    <div>
      <div className="grid min-h-[420px] gap-4 md:grid-cols-[1fr_54px]">
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart margin={{ top: 24, right: 26, bottom: 44, left: 22 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" opacity={0.75} />
            <XAxis type="number" dataKey="count" name="岗位数量" domain={[0, Math.ceil(maxCount * 1.08)]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} label={{ value: "岗位数量", position: "bottom", offset: 16, fontSize: 12, fill: "var(--foreground)" }} />
            <YAxis type="number" dataKey="salary" name="平均薪资" domain={[minSalary, maxSalary]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} tickFormatter={(value) => `${value}`} label={{ value: "平均薪资(k)", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--foreground)" }} />
            <ZAxis type="number" dataKey="bubbleSize" range={[70, 2500]} name="岗位数量" />
            <Tooltip content={<BubbleTooltip />} />
            <Scatter name="岗位类型" data={displayData} fillOpacity={0.72} stroke="#ffffff" strokeWidth={1.5}>
              {displayData.map((item) => (
                <Cell key={item.name} fill={educationColor(item.educationScore)} />
              ))}
              <LabelList dataKey="name" position="top" className="fill-foreground" fontSize={10} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div
            className="h-72 w-4 rounded-sm border border-border"
            style={{
              background: "linear-gradient(to top, #6d28d9 0%, #e879f9 35%, #fdba74 70%, #fef08a 100%)",
            }}
          />
          <div className="flex h-72 flex-col justify-between text-[10px] text-muted-foreground">
            <span>2.1</span>
            <span>2.0</span>
            <span>1.9</span>
            <span>1.8</span>
            <span>1.7</span>
            <span>1.6</span>
            <span>1.5</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center text-xs text-muted-foreground">
        说明：气泡越大表示需求量越高，颜色越偏亮表示平均学历要求更高。
      </div>
    </div>
  );
}

export function CityJobStackedChart({ data, stackTypes }: { data: CityJobStructureDatum[]; stackTypes: string[] }) {
  const percentData = data.map((city) => {
    const row: Record<string, string | number> = {
      city: city.city,
      total: city.total,
    };

    for (const type of stackTypes) {
      row[type] = city.total
        ? Number(((Number(city[type] ?? 0) / Number(city.total)) * 100).toFixed(1))
        : 0;
    }

    return row;
  });

  return (
    <div>
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={percentData} margin={{ top: 12, right: 24, bottom: 62, left: 8 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" opacity={0.7} vertical={false} />
            <XAxis
              dataKey="city"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={72}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`${Number(value).toFixed(1)}%`, name]}
              labelFormatter={(label) => `${label}岗位类型结构`}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            {stackTypes.map((type, index) => (
              <Bar
                key={type}
                dataKey={type}
                stackId="jobType"
                fill={STACK_COLORS[index % STACK_COLORS.length]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {stackTypes.map((type, index) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: STACK_COLORS[index % STACK_COLORS.length] }}
            />
            {type}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        说明：每根柱子代表一个城市，柱内各色块按当前展示的岗位类型占比归一化为 100%。
      </p>
    </div>
  );
}
