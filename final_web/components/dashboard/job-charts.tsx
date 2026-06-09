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
  const percentData = data.map((city) => ({
    city: city.city,
    total: city.total,
    values: stackTypes.map((type) =>
      city.total ? Number((Number(city[type] ?? 0) / Number(city.total) * 100).toFixed(0)) : 0
    ),
  }));
  const maxValue = Math.max(...percentData.flatMap((row) => row.values), 1);
  const cellStyle = (value: number) => {
    const intensity = value / maxValue;
    const hue = 58 + intensity * 162;
    const lightness = 94 - intensity * 48;
    return {
      backgroundColor: `hsl(${hue}, 86%, ${lightness}%)`,
      color: intensity > 0.55 ? "#ffffff" : "#172033",
    };
  };

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <table className="w-full table-fixed border-collapse text-xs">
            <thead>
              <tr>
                <th className="w-14 pb-2 text-left font-medium text-muted-foreground">城市</th>
                {stackTypes.map((type) => (
                  <th key={type} className="h-24 align-bottom">
                    <span className="inline-block origin-bottom-left whitespace-nowrap text-[11px] font-medium text-foreground" style={{ transform: "rotate(-40deg)" }}>
                      {type}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {percentData.map((row) => (
                <tr key={row.city}>
                  <td className="h-9 pr-2 text-right text-sm font-medium text-foreground">{row.city}</td>
                  {row.values.map((value, index) => (
                    <td key={`${row.city}-${stackTypes[index]}`} className="border border-background p-0.5">
                      <div
                        title={`${row.city} - ${stackTypes[index]}：${value}%`}
                        className="flex h-8 items-center justify-center rounded-sm text-[11px] font-semibold"
                        style={cellStyle(value)}
                      >
                        {value > 0 ? `${value}%` : ""}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 hidden min-w-14 flex-col items-center gap-2 md:flex">
          <div
            className="h-72 w-5 rounded-sm border border-border"
            style={{ background: "linear-gradient(to top, #fffde7 0%, #e6f5a8 25%, #81d4c7 50%, #2b8cbe 75%, #081d58 100%)" }}
          />
          <div className="flex h-72 -translate-y-[18.5rem] translate-x-8 flex-col justify-between text-[10px] text-muted-foreground">
            <span>{Math.ceil(maxValue / 5) * 5}</span>
            <span>{Math.ceil(maxValue * 0.75)}</span>
            <span>{Math.ceil(maxValue * 0.5)}</span>
            <span>{Math.ceil(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        说明：每一行表示一个城市内部的岗位类型占比，行内百分比按当前展示的岗位类型重新归一化。
      </p>
    </div>
  );
}
