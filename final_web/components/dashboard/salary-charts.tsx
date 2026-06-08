"use client";

import { Bar, Cell, ComposedChart, LabelList, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SalaryAnalysisData, SalaryBoxDatum, SalaryHistogramDatum, SalaryTierDatum } from "@/lib/salary-data";

type SalaryChartProps = {
  data?: SalaryAnalysisData;
};

const salaryHistogram = [
  { range: "5-8k", count: 45 },
  { range: "8-10k", count: 78 },
  { range: "10-12k", count: 125 },
  { range: "12-15k", count: 198 },
  { range: "15-18k", count: 245 },
  { range: "18-20k", count: 187 },
  { range: "20-25k", count: 156 },
  { range: "25-30k", count: 98 },
  { range: "30-40k", count: 67 },
  { range: "40k+", count: 37 },
];

const salaryTotal = salaryHistogram.reduce((sum, item) => sum + item.count, 0);
const salaryDistribution = salaryHistogram.map((item, index, data) => {
  const previous = data[index - 1]?.count ?? item.count;
  const next = data[index + 1]?.count ?? item.count;
  const smoothedCount = previous * 0.25 + item.count * 0.5 + next * 0.25;

  return {
    ...item,
    density: Number(((smoothedCount / salaryTotal) * 100).toFixed(1)),
  };
});

const salaryTiers = [
  { name: "10k以下", value: 123, percentage: 10 },
  { name: "10-15k", value: 223, percentage: 18 },
  { name: "15-20k", value: 432, percentage: 35 },
  { name: "20-25k", value: 254, percentage: 21 },
  { name: "25-30k", value: 98, percentage: 8 },
  { name: "30k以上", value: 106, percentage: 8 },
];

const cityBoxData = [
  { city: "北京", min: 10, q1: 15, median: 20, q3: 28, max: 45 },
  { city: "上海", min: 9, q1: 14, median: 19, q3: 26, max: 42 },
  { city: "深圳", min: 10, q1: 16, median: 21, q3: 30, max: 50 },
  { city: "杭州", min: 8, q1: 13, median: 17, q3: 24, max: 38 },
  { city: "广州", min: 7, q1: 12, median: 15, q3: 22, max: 35 },
  { city: "成都", min: 6, q1: 10, median: 14, q3: 19, max: 30 },
];

const positionBoxData = [
  { position: "算法工程师", min: 12, q1: 18, median: 25, q3: 35, max: 55 },
  { position: "深度学习", min: 14, q1: 20, median: 28, q3: 38, max: 60 },
  { position: "NLP工程师", min: 13, q1: 19, median: 26, q3: 36, max: 52 },
  { position: "CV工程师", min: 12, q1: 17, median: 24, q3: 32, max: 48 },
  { position: "数据科学家", min: 10, q1: 15, median: 22, q3: 30, max: 45 },
  { position: "大模型工程师", min: 18, q1: 25, median: 35, q3: 48, max: 70 },
];

const COLORS = ["#93c5fd", "#60a5fa", "#38bdf8", "#22d3ee", "#fde68a", "#facc15"];

const fallbackData: SalaryAnalysisData = {
  histogram: salaryHistogram,
  tiers: salaryTiers,
  cityBoxes: cityBoxData,
  positionBoxes: positionBoxData,
};

function makeSalaryDistribution(histogram: SalaryHistogramDatum[]) {
  const salaryTotal = histogram.reduce((sum, item) => sum + item.count, 0);

  return histogram.map((item, index, items) => {
    const previous = items[index - 1]?.count ?? item.count;
    const next = items[index + 1]?.count ?? item.count;
    const smoothedCount = previous * 0.25 + item.count * 0.5 + next * 0.25;

    return {
      ...item,
      density: salaryTotal ? Number(((smoothedCount / salaryTotal) * 100).toFixed(1)) : 0,
    };
  });
}

function makeSalaryTierData(tiers: SalaryTierDatum[]) {
  const salaryTierTotal = tiers.reduce((sum, tier) => sum + tier.value, 0);

  return tiers.map((tier) => ({
    ...tier,
    percentage: salaryTierTotal ? Number(((tier.value / salaryTierTotal) * 100).toFixed(1)) : 0,
  }));
}

export function SalaryHistogramChart({ data = fallbackData }: SalaryChartProps = {}) {
  const salaryDistribution = makeSalaryDistribution(data.histogram);
  const maxDensity = Math.max(...salaryDistribution.map((item) => item.density), 10);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={salaryDistribution} margin={{ left: -10, right: 10, bottom: 10, top: 20 }}>
          <XAxis dataKey="range" tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" height={50} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" domain={[0, Math.ceil(maxDensity * 1.25)]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number, name: string) =>
              name === "密度曲线" ? [`${value}%`, name] : [`${value} 个实习岗位`, name]
            }
            contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="count" name="实习岗位数量" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="count" position="top" className="fill-foreground" fontSize={11} />
            {salaryDistribution.map((entry, index) => <Cell key={index} fill={entry.count >= 200 ? "var(--chart-1)" : entry.count >= 150 ? "var(--chart-2)" : "var(--chart-3)"} />)}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="density" name="密度曲线" stroke="var(--chart-5)" strokeWidth={2.5} dot={{ fill: "var(--chart-5)", r: 4 }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SalaryTiersPieChart({ data = fallbackData }: SalaryChartProps = {}) {
  const salaryTierData = makeSalaryTierData(data.tiers);

  return (
    <div className="min-h-[300px]">
      <div className="h-[300px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={salaryTierData} cx="50%" cy="46%" innerRadius={48} outerRadius={82} dataKey="value" nameKey="name" label={({ percentage }) => `${percentage}%`} labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}>
              {salaryTierData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Legend verticalAlign="bottom" height={42} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number, _name, props) => [`${value} 个实习岗位，占比 ${props.payload.percentage}%`, props.payload.name]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BoxPlot({ data, labelKey, color, domainMax }: { data: SalaryBoxDatum[]; labelKey: "city" | "position"; color: string; domainMax: number }) {
  const width = 720;
  const height = 320;
  const margin = { top: 18, right: 28, bottom: labelKey === "position" ? 70 : 48, left: 48 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const tickStep = domainMax <= 50 ? 10 : 15;
  const ticks = Array.from({ length: Math.floor(domainMax / tickStep) + 1 }, (_, index) => index * tickStep);
  const slotWidth = plotWidth / data.length;
  const boxWidth = Math.min(38, slotWidth * 0.56);
  const x = (index: number) => margin.left + (index + 0.5) * slotWidth;
  const y = (value: number) => margin.top + plotHeight - (value / domainMax) * plotHeight;

  return (
    <div className="h-[340px]">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" className="h-full w-full overflow-visible">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke="var(--border)" strokeDasharray="3 4" />
            <text x={margin.left - 10} y={y(tick) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
              {tick}k
            </text>
          </g>
        ))}
        <line x1={margin.left} x2={margin.left} y1={margin.top} y2={height - margin.bottom} stroke="var(--border)" />
        <line x1={margin.left} x2={width - margin.right} y1={height - margin.bottom} y2={height - margin.bottom} stroke="var(--border)" />
        {data.map((entry, index) => {
          const label = (entry[labelKey] ?? "") as string;
          const min = entry.min as number;
          const q1 = entry.q1 as number;
          const median = entry.median as number;
          const q3 = entry.q3 as number;
          const max = entry.max as number;
          const centerX = x(index);

          return (
            <g key={label} className="cursor-pointer">
              <title>{`${label}：最低 ${min}k，下四分位 ${q1}k，中位数 ${median}k，上四分位 ${q3}k，最高 ${max}k`}</title>
              <text
                x={centerX}
                y={height - margin.bottom + 18}
                textAnchor="end"
                transform={`rotate(-35 ${centerX} ${height - margin.bottom + 18})`}
                className="fill-foreground text-[11px]"
              >
                {label}
              </text>
              <line x1={centerX} x2={centerX} y1={y(max)} y2={y(min)} stroke={color} strokeWidth={2} />
              <line x1={centerX - boxWidth * 0.32} x2={centerX + boxWidth * 0.32} y1={y(min)} y2={y(min)} stroke={color} strokeWidth={2} />
              <line x1={centerX - boxWidth * 0.32} x2={centerX + boxWidth * 0.32} y1={y(max)} y2={y(max)} stroke={color} strokeWidth={2} />
              <rect x={centerX - boxWidth / 2} y={y(q3)} width={boxWidth} height={y(q1) - y(q3)} rx={4} fill={color} fillOpacity={0.28} stroke={color} strokeWidth={1.5} />
              <line x1={centerX - boxWidth / 2 - 3} x2={centerX + boxWidth / 2 + 3} y1={y(median)} y2={y(median)} stroke="var(--chart-5)" strokeWidth={3} />
              <circle cx={centerX} cy={y(min)} r={3} fill={color} />
              <circle cx={centerX} cy={y(max)} r={3} fill={color} />
              <text x={centerX + boxWidth / 2 + 5} y={y(max) + 4} className="fill-muted-foreground text-[10px]">
                {max}k
              </text>
              <text x={centerX + boxWidth / 2 + 5} y={y(median) + 4} className="fill-foreground text-[10px] font-medium">
                {median}k
              </text>
              <text x={centerX + boxWidth / 2 + 5} y={y(min) + 4} className="fill-muted-foreground text-[10px]">
                {min}k
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        标注显示最高值、中位数和最低值；箱体表示 Q1-Q3，完整四分位数请悬停查看。
      </p>
    </div>
  );
}

function boxDomain(data: SalaryBoxDatum[], fallback: number) {
  const max = Math.max(...data.map((item) => item.max), fallback);
  return Math.ceil((max * 1.12) / 5) * 5;
}

export function CityBoxPlotChart({ data = fallbackData }: SalaryChartProps = {}) {
  return <BoxPlot data={data.cityBoxes} labelKey="city" color="var(--chart-1)" domainMax={boxDomain(data.cityBoxes, 10)} />;
}

export function PositionBoxPlotChart({ data = fallbackData }: SalaryChartProps = {}) {
  return <BoxPlot data={data.positionBoxes} labelKey="position" color="var(--chart-2)" domainMax={boxDomain(data.positionBoxes, 10)} />;
}
