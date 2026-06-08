"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Legend,
  ReferenceLine,
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
const STACK_COLORS = ["#8b5cf6", "#a78bfa", "#6366f1", "#818cf8", "#3b82f6", "#60a5fa"];

const EDUCATION_LEGEND = [
  { label: "不限", score: 0, size: 8, color: "#dbeafe" },
  { label: "大专", score: 1, size: 11, color: "#93c5fd" },
  { label: "本科", score: 2, size: 17, color: "#60a5fa" },
  { label: "硕士", score: 3, size: 24, color: "#6d28d9" },
  { label: "博士", score: 4, size: 29, color: "#4c1d95" },
];

const educationStyle = (educationName: string) =>
  EDUCATION_LEGEND.find((item) => item.label === educationName) ?? EDUCATION_LEGEND[0];

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
      <p className="mt-1 text-muted-foreground">实习岗位数量：{item.count} 个</p>
      <p className="text-muted-foreground">平均实习薪资：{item.salary}k</p>
      <p className="text-muted-foreground">学历要求：{item.educationName}</p>
      <p className="text-muted-foreground">门槛评分：{item.educationScore}</p>
    </div>
  );
}

export function JobBubbleChart({ data }: { data: JobBubbleDatum[] }) {
  const avgCount = Number((data.reduce((sum, item) => sum + item.count, 0) / data.length).toFixed(1));
  const avgSalary = Number((data.reduce((sum, item) => sum + item.salary, 0) / data.length).toFixed(1));
  const displayData = data.map((item) => ({
    ...item,
    plotCount: Number((item.count + ((item.educationScore - 2) * 12)).toFixed(1)),
    plotSalary: Number((item.salary + ((item.educationScore - 2) * 0.12)).toFixed(2)),
    educationSize: Math.pow(educationStyle(item.educationName).score + 0.8, 2.4),
    showLabel: item.educationName === "博士" || item.salary >= avgSalary + 1 || item.count >= avgCount * 1.8,
  }));
  const maxCount = Math.max(...data.map((item) => item.count), 1);
  const maxSalary = Math.ceil(Math.max(...data.map((item) => item.salary), 1)) + 1;

  return (
    <div>
      <div className="relative h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 28, right: 54, bottom: 28, left: 20 }}>
          <XAxis type="number" dataKey="plotCount" name="实习岗位数量" domain={[0, Math.ceil(maxCount * 1.08)]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} label={{ value: "实习岗位数量", position: "bottom", offset: 0, fontSize: 12, fill: "var(--muted-foreground)" }} />
          <YAxis type="number" dataKey="plotSalary" name="平均实习薪资" domain={[0, maxSalary]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} tickFormatter={(v) => `${v}k`} label={{ value: "平均实习薪资(k)", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--muted-foreground)" }} />
          <ZAxis type="number" dataKey="educationSize" range={[100, 2800]} name="学历门槛" />
          <ReferenceLine x={avgCount} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: "平均需求", position: "top", fill: "var(--muted-foreground)", fontSize: 11 }} />
          <ReferenceLine y={avgSalary} stroke="var(--chart-5)" strokeDasharray="4 4" label={{ value: `平均实习薪资 ${avgSalary}k`, position: "right", fill: "var(--foreground)", fontSize: 11 }} />
          <Tooltip content={<BubbleTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
          <Scatter name="气泡大小 = 学历门槛" data={displayData} fill="#8b5cf6" fillOpacity={0.48} stroke="#312e81" strokeWidth={1.4}>
            {displayData.map((item) => (
              <Cell key={`${item.name}-${item.educationName}`} fill={educationStyle(item.educationName).color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-8 top-8 hidden h-[300px] md:block">
        {displayData.filter((item) => item.showLabel).slice(0, 8).map((item) => (
          <span
            key={`${item.name}-${item.educationName}-label`}
            className="absolute rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-foreground shadow-sm"
            style={{
              left: `${Math.min(88, Math.max(5, (item.plotCount / Math.max(maxCount, 1)) * 90))}%`,
              top: `${Math.min(86, Math.max(4, 92 - (item.plotSalary / Math.max(maxSalary, 1)) * 88))}%`,
            }}
          >
            {item.name}-{item.educationName}
          </span>
        ))}
      </div>
      </div>
      <div className="mt-4 mb-6 flex flex-wrap items-center justify-center gap-4 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <span>气泡大小表示学历门槛</span>
        {EDUCATION_LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span
              className="rounded-full ring-1 ring-violet-700/40"
              style={{ width: `${item.size}px`, height: `${item.size}px`, backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
        <span>参考线区分实习需求和薪资是否高于均值</span>
      </div>
    </div>
  );
}

export function CityJobStackedChart({ data, stackTypes }: { data: CityJobStructureDatum[]; stackTypes: string[] }) {
  const percentData = data.map((city) => {
    const total = city.total || stackTypes.reduce((sum, type) => sum + Number(city[type] ?? 0), 0);
    const item: CityJobStructureDatum = { city: city.city, total };

    stackTypes.forEach((type) => {
      item[type] = total ? Number((Number(city[type] ?? 0) / Number(total) * 100).toFixed(1)) : 0;
    });

    return item;
  });

  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={percentData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <XAxis dataKey="city" tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "结构占比", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--muted-foreground)" }} />
          <Tooltip formatter={(value: number, name: string, props) => [`${value}%`, name]} labelFormatter={(label, payload) => {
            const total = payload?.[0]?.payload?.total;
            return total ? `${label}：共 ${total} 个实习岗位` : label;
          }} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11, paddingBottom: 10 }} />
          {stackTypes.map((type, index) => (
            <Bar
              key={type}
              dataKey={type}
              stackId="a"
              fill={STACK_COLORS[index % STACK_COLORS.length]}
              name={type}
              radius={index === stackTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
