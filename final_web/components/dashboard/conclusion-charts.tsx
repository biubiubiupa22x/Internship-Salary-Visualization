"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import type {
  CompetitivenessPoint,
  FinalConclusion,
  HeatmapRow,
  RadarDataPoint,
} from "@/lib/conclusion-data";

import { ChartCard } from "./chart-card";

function Heatmap({
  rows,
  columns,
  unit = "个岗位",
  colorScheme = "purple",
  showPercentageLabels = false,
  showThermometerLegend = false,
}: {
  rows: HeatmapRow[];
  columns: string[];
  unit?: string;
  colorScheme?: "purple" | "blue" | "temperature" | "blueYellow";
  showPercentageLabels?: boolean;
  showThermometerLegend?: boolean;
}) {
  const rowTotals = rows.map((row) => row.values.reduce((sum, value) => sum + value, 0));
  const percentages = rows.flatMap((row, rowIndex) => {
    const rowTotal = rowTotals[rowIndex] || 1;
    return row.values.map((value) => (value / rowTotal) * 100);
  });
  const max = Math.max(...(showPercentageLabels ? percentages : rows.flatMap((row) => row.values)), 1);

  const getPercentage = (value: number, rowIndex: number) => {
    const rowTotal = rowTotals[rowIndex] || 1;
    return Number(((value / rowTotal) * 100).toFixed(1));
  };

  const getCellStyle = (value: number, rowIndex: number) => {
    const metric = showPercentageLabels ? getPercentage(value, rowIndex) : value;
    const intensity = metric / max;
    if (colorScheme === "temperature") {
      const hue = 48 - intensity * 42;
      const lightness = 88 - intensity * 38;
      return {
        backgroundColor: `hsla(${hue}, 88%, ${lightness}%, ${0.38 + intensity * 0.56})`,
        borderColor: `hsla(${hue}, 84%, ${Math.max(lightness - 12, 34)}%, ${0.3 + intensity * 0.48})`,
        color: intensity > 0.72 ? "#ffffff" : "#0f172a",
      };
    }
    if (colorScheme === "blueYellow") {
      const hue = 48 + intensity * 162;
      const lightness = 88 - intensity * 34;
      return {
        backgroundColor: `hsla(${hue}, 88%, ${lightness}%, ${0.38 + intensity * 0.56})`,
        borderColor: `hsla(${hue}, 84%, ${Math.max(lightness - 12, 34)}%, ${0.3 + intensity * 0.48})`,
        color: intensity > 0.68 ? "#ffffff" : "#0f172a",
      };
    }
    const hue = colorScheme === "blue" ? 220 - intensity * 216 : 262;
    const saturation = colorScheme === "blue" ? 86 : 72;
    const lightness = colorScheme === "blue" ? 50 + Math.abs(intensity - 0.5) * 22 : 96 - intensity * 52;
    return {
      backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.36 + intensity * 0.6})`,
      borderColor: `hsla(${hue}, ${saturation}%, ${Math.max(lightness - 10, 30)}%, ${0.26 + intensity * 0.5})`,
      color: colorScheme === "blue" && intensity > 0.72 ? "#ffffff" : "#0f172a",
    };
  };

  return (
    <div className="overflow-x-auto">
      <div className={showThermometerLegend ? "flex min-w-max items-center gap-5" : ""}>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-medium text-muted-foreground">城市</th>
              {columns.map((column) => (
                <th key={column} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.city}>
                <td className="whitespace-nowrap p-2 font-medium text-foreground">{row.city}</td>
                {row.values.map((value, index) => {
                  const percentage = getPercentage(value, rowIndex);
                  return (
                    <td key={`${row.city}-${columns[index]}`} className="p-1">
                      <div
                        title={`${row.city} - ${columns[index]}：${value} ${unit}，占该城市 ${percentage}%`}
                        className="flex h-9 items-center justify-center rounded border text-[11px] font-semibold transition-transform hover:scale-105"
                        style={getCellStyle(value, rowIndex)}
                      >
                        {showPercentageLabels ? `${percentage}%` : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {showThermometerLegend ? (
          <div className="flex min-w-16 flex-col items-center gap-2 pr-1 text-xs text-muted-foreground">
            <span>高</span>
            <div className="relative h-52 w-8">
              <div
                className={`absolute left-1/2 top-0 h-52 w-5 -translate-x-1/2 rounded-full border shadow-inner ${
                  colorScheme === "blueYellow"
                    ? "border-blue-300/70 bg-gradient-to-b from-blue-700 via-sky-400 to-yellow-200"
                    : "border-amber-300/70 bg-gradient-to-b from-red-600 via-orange-400 to-yellow-200"
                }`}
              />
            </div>
            <span>低</span>
            <span className="mt-1 text-center leading-4">岗位占比</span>
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {showPercentageLabels
          ? colorScheme === "blueYellow"
            ? "多数城市的实习岗位结构以产品、数据和技术开发方向为主，头部城市类型更丰富；悬停可查看具体数量和占比。"
            : "多数城市的实习薪资集中在 3-6k 档位，上海、北京、深圳等核心城市在 6-10k 档位也更活跃。"
          : "头部单元格集中在少数城市和类别，说明 AI 相关实习机会存在明显结构差异；悬停可查看完整数值。"}
      </p>
    </div>
  );
}

export function CitySalaryHeatmap({
  rows,
  columns,
}: {
  rows: HeatmapRow[];
  columns: string[];
}) {
  return (
    <ChartCard
      title="城市 x 实习薪资档位分布"
      subtitle="不同城市各实习薪资档位的实习岗位数量"
      insight="大多数城市的实习薪资集中在 3-6k 区间，上海、北京、深圳等核心城市在 6-10k 档位中表现更突出，说明核心城市更容易出现中高薪实习岗位。"
    >
      <Heatmap rows={rows} columns={columns} colorScheme="temperature" showPercentageLabels showThermometerLegend />
    </ChartCard>
  );
}

export function CityJobHeatmap({
  rows,
  columns,
}: {
  rows: HeatmapRow[];
  columns: string[];
}) {
  return (
    <ChartCard
      title="城市 x 实习岗位类型分布"
      subtitle="不同城市各实习岗位类型需求强度"
      insight="产品、数据、算法、后端和 Java 是多数城市中的主要实习岗位类型，但不同城市侧重点不同，头部城市岗位类型更丰富，部分城市技术开发类岗位占比更高。"
    >
      <Heatmap rows={rows} columns={columns} colorScheme="blueYellow" showPercentageLabels showThermometerLegend />
    </ChartCard>
  );
}

export function CompetitivenessScatterChart({ data }: { data: CompetitivenessPoint[] }) {
  const levelColors: Record<string, string> = {
    基础门槛: "#a78bfa",
    中等门槛: "#8b5cf6",
    较高门槛: "#6366f1",
    高门槛: "#4338ca",
  };
  const validData = data.filter((item) => Number.isFinite(item.score) && Number.isFinite(item.salary));
  const avgScore = Number((validData.reduce((sum, item) => sum + item.score, 0) / Math.max(validData.length, 1)).toFixed(2));
  const avgSalary = Number((validData.reduce((sum, item) => sum + item.salary, 0) / Math.max(validData.length, 1)).toFixed(2));
  const scoreMax = Math.ceil(Math.max(...validData.map((item) => item.score), 1) * 10) / 10;
  const salaryMax = Math.ceil(Math.max(...validData.map((item) => item.salary), 1)) + 1;

  const tooltipContent = ({ active, payload }: { active?: boolean; payload?: Array<{ payload?: CompetitivenessPoint }> }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    if (!item) return null;
    return (
      <div className="rounded-lg border border-border bg-card p-3 text-xs shadow-lg">
        <p className="max-w-56 font-semibold text-foreground">{item.title}</p>
        <p className="mt-2 text-muted-foreground">学历要求：{item.education}</p>
        <p className="text-muted-foreground">经验要求：{item.experience || "不限"}</p>
        <p className="text-muted-foreground">技能数量：{item.skillCount ?? 0}</p>
        <p className="text-muted-foreground">竞争力评分：{item.score.toFixed(3)}</p>
        <p className="text-muted-foreground">实习薪资水平：{item.salary}k</p>
      </div>
    );
  };

  return (
    <ChartCard
      title="实习岗位竞争力评分与薪资四象限分析"
      subtitle="以平均竞争力评分和平均实习薪资为分割线，识别不同类型实习岗位的薪资回报与门槛特征。"
      insight="综合门槛评分越高的岗位，实习薪资整体也更高；高薪岗位通常伴随更高学历要求和更多技能要求，说明薪资与岗位门槛之间存在一定正向关系。"
    >
      {validData.length < 4 ? (
        <div className="flex h-[340px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
          当前数据不足以绘制四象限图
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 58, right: 34, bottom: 42, left: 8 }}>
          <ReferenceArea x1={avgScore} x2={scoreMax} y1={avgSalary} y2={salaryMax} fill="#22c55e" fillOpacity={0.08} label={{ value: "高价值实习", position: "insideTopRight", fill: "var(--foreground)", fontSize: 11 }} />
          <ReferenceArea x1={0} x2={avgScore} y1={avgSalary} y2={salaryMax} fill="#f59e0b" fillOpacity={0.08} label={{ value: "机会型实习", position: "insideTopLeft", fill: "var(--foreground)", fontSize: 11 }} />
          <ReferenceArea x1={avgScore} x2={scoreMax} y1={0} y2={avgSalary} fill="#6366f1" fillOpacity={0.07} label={{ value: "高门槛低回报", position: "insideBottomRight", fill: "var(--muted-foreground)", fontSize: 11 }} />
          <ReferenceArea x1={0} x2={avgScore} y1={0} y2={avgSalary} fill="#94a3b8" fillOpacity={0.07} label={{ value: "基础型实习", position: "insideBottomLeft", fill: "var(--muted-foreground)", fontSize: 11 }} />
          <XAxis
            type="number"
            dataKey="score"
            name="竞争力评分"
            domain={[0, scoreMax]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            label={{ value: "竞争力评分", position: "insideBottom", offset: -18, fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="salary"
            name="实习薪资(k)"
            domain={[0, salaryMax]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            label={{ value: "实习薪资(k)", angle: -90, position: "insideLeft", fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="skillCount" range={[36, 130]} domain={[0, "dataMax"]} />
          <ReferenceLine x={avgScore} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: "平均竞争力", position: "top", fill: "var(--muted-foreground)", fontSize: 11 }} />
          <ReferenceLine y={avgSalary} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "平均实习薪资", position: "right", fill: "var(--foreground)", fontSize: 11 }} />
          <Tooltip content={tooltipContent} />
          <Legend verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ top: 8, fontSize: 12 }} />
          {Object.keys(levelColors).map((level) => (
            <Scatter
              key={level}
              name={level}
              data={validData.filter((item) => item.level === level)}
              fill={levelColors[level]}
              fillOpacity={0.58}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

export function CorrelationHeatmap({
  variables,
  matrix,
}: {
  variables: string[];
  matrix: number[][];
}) {
  const parseHex = (hex: string) => {
    const clean = hex.replace("#", "");
    return {
      r: Number.parseInt(clean.slice(0, 2), 16),
      g: Number.parseInt(clean.slice(2, 4), 16),
      b: Number.parseInt(clean.slice(4, 6), 16),
    };
  };
  const mixColor = (from: string, to: string, ratio: number) => {
    const start = parseHex(from);
    const end = parseHex(to);
    const mix = (a: number, b: number) => Math.round(a + (b - a) * ratio);
    return `rgb(${mix(start.r, end.r)}, ${mix(start.g, end.g)}, ${mix(start.b, end.b)})`;
  };
  const getCellStyle = (value: number) => {
    const clamped = Math.max(-1, Math.min(1, value));
    const backgroundColor = clamped >= 0
      ? mixColor("#ffffbf", "#b40426", clamped)
      : mixColor("#ffffbf", "#313695", Math.abs(clamped));
    const textColor = Math.abs(clamped) > 0.55 ? "#ffffff" : "#1f2937";
    return {
      backgroundColor,
      color: textColor,
      borderColor: Math.abs(clamped) > 0.55 ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.08)",
    };
  };

  return (
    <ChartCard
      title="数值变量相关性热力图"
      subtitle="最低薪资、最高薪资、平均薪资、学历分数、竞争力评分和技能数量之间的相关性"
      insight="最低薪资、最高薪资和平均薪资之间相关性最强，竞争力评分与平均薪资也存在一定正相关，说明岗位综合要求越高，薪资水平通常也越高。"
    >
      <div className="overflow-hidden pb-1">
        <div className="mx-auto flex w-full items-center justify-center gap-3">
          <table className="shrink-0 border-separate border-spacing-1 text-xs">
            <thead>
              <tr>
                <th className="h-14 w-[58px] p-1" />
                {variables.map((variable) => (
                  <th key={variable} className="h-14 w-[54px] align-bottom">
                    <span className="inline-block origin-bottom-left whitespace-nowrap text-[10px] font-medium text-foreground" style={{ transform: "rotate(-38deg)" }}>
                      {variable}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variables.map((row, rowIndex) => (
                <tr key={row}>
                  <td className="h-12 w-[58px] whitespace-nowrap pr-1 text-right text-xs font-medium text-foreground">{row}</td>
                  {matrix[rowIndex].map((value, colIndex) => (
                    <td key={`${row}-${variables[colIndex]}`} className="p-0">
                      <div
                        title={`${row} 与 ${variables[colIndex]}：${value.toFixed(2)}`}
                        className="flex h-12 w-[54px] items-center justify-center rounded-md border text-[12px] font-semibold shadow-sm transition-transform hover:scale-105"
                        style={getCellStyle(value)}
                      >
                        {value.toFixed(2)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex shrink-0 items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <div className="relative h-56 w-6">
              <div
                className="absolute left-1/2 top-0 h-56 w-4 -translate-x-1/2 rounded-full border border-border shadow-inner"
                style={{ background: "linear-gradient(to bottom, #b40426 0%, #f46d43 25%, #ffffbf 50%, #74add1 75%, #313695 100%)" }}
              />
            </div>
            <div className="flex h-56 flex-col justify-between">
              <span>1.00</span>
              <span>0.75</span>
              <span>0.50</span>
              <span>0.25</span>
              <span>0.00</span>
              <span>-0.25</span>
              <span>-0.50</span>
              <span>-0.75</span>
              <span>-1.00</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          红色表示正相关更强，蓝色表示负相关更强，浅黄色表示相关性接近 0；悬停可查看变量组合的具体相关系数。
        </p>
      </div>
    </ChartCard>
  );
}

export function CityRadarChart({
  data,
  cities,
}: {
  data: RadarDataPoint[];
  cities: string[];
}) {
  const colors = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <ChartCard
      title="Top 城市综合画像雷达图"
      subtitle="从实习岗位数量、平均实习薪资、实习岗位丰富度、学历门槛和技能数量五个维度比较城市"
      insight="上海在实习岗位数量和岗位丰富度方面表现突出，北京在平均实习薪资方面更有优势，深圳在技能数量和学历门槛方面较强，说明不同城市的实习岗位优势并不相同。"
    >
      <ResponsiveContainer width="100%" height={430}>
        <RadarChart data={data} margin={{ top: 24, right: 116, bottom: 48, left: 34 }}>
          <PolarGrid stroke="var(--border)" strokeDasharray="4 4" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "var(--foreground)", fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 1]}
            tickCount={4}
            tickFormatter={(value) => Number(value).toFixed(2)}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          />
          {cities.map((city, index) => (
            <Radar
              key={city}
              name={city}
              dataKey={city}
              stroke={colors[index % colors.length]}
              strokeWidth={2.3}
              fill={colors[index % colors.length]}
              fillOpacity={0.1}
            />
          ))}
          <Legend
            align="right"
            verticalAlign="middle"
            layout="vertical"
            iconType="line"
            wrapperStyle={{ right: 8, fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [Number(value).toFixed(2), "归一化得分"]}
            contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="-mt-5 px-2 text-center text-xs text-muted-foreground">
        上海更偏岗位规模优势，北京更偏薪资优势，深圳在技能数量和学历门槛上更突出，城市之间呈现不同的实习机会特征。
      </p>
    </ChartCard>
  );
}

export function FinalConclusionCard({ conclusion }: { conclusion: FinalConclusion }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold text-foreground">综合结论</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{conclusion.text}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {conclusion.metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
