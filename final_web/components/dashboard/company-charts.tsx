"use client";

import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type {
  CompanyAnalysisData,
  IndustryDemandDatum,
} from "@/lib/company-data";

type CompanyChartProps = {
  data?: CompanyAnalysisData;
};

const industryData = [
  { name: "互联网/游戏/软件", value: 4569, percentage: 56.1 },
  { name: "汽车/机械/制造", value: 893, percentage: 11.0 },
  { name: "电子/通信/硬件", value: 480, percentage: 5.9 },
  { name: "金融/经济/投资/财会", value: 419, percentage: 5.1 },
  { name: "广告/传媒/公关/展览", value: 339, percentage: 4.2 },
  { name: "企业服务/咨询", value: 299, percentage: 3.7 },
  { name: "教育/培训", value: 287, percentage: 3.5 },
  { name: "其他行业", value: 862, percentage: 10.6 },
];

const companySizeData = [
  { size: "2000人以上", count: 4428, percentage: 54.3 },
  { size: "500-2000人", count: 1011, percentage: 12.4 },
  { size: "15-50人", count: 833, percentage: 10.2 },
  { size: "150-500人", count: 766, percentage: 9.4 },
  { size: "50-150人", count: 700, percentage: 8.6 },
  { size: "少于15人", count: 271, percentage: 3.3 },
  { size: "15人以下", count: 133, percentage: 1.6 },
  { size: "其他/未知", count: 7, percentage: 0.1 },
];

const industrySalaryBubble = [
  { industry: "互联网/游戏/软件", jobs: 4569, salary: 4.6, percentage: 56.1 },
  { industry: "汽车/机械/制造", jobs: 893, salary: 4.46, percentage: 11.0 },
  { industry: "电子/通信/硬件", jobs: 480, salary: 4.87, percentage: 5.9 },
  { industry: "金融/经济/投资/财会", jobs: 419, salary: 3.65, percentage: 5.1 },
  { industry: "广告/传媒/公关/展览", jobs: 339, salary: 2.83, percentage: 4.2 },
  { industry: "企业服务/咨询", jobs: 299, salary: 3.65, percentage: 3.7 },
  { industry: "教育/培训", jobs: 287, salary: 3.54, percentage: 3.5 },
  { industry: "快消/百货/批发/零售", jobs: 241, salary: 3.41, percentage: 3.0 },
  { industry: "医疗/健康/制药/生物", jobs: 200, salary: 3.74, percentage: 2.5 },
  { industry: "房产/家居/物业/建筑", jobs: 111, salary: 2.84, percentage: 1.4 },
  { industry: "化工/能源/环保", jobs: 67, salary: 3.62, percentage: 0.8 },
  { industry: "公共事业/NGO/政府", jobs: 59, salary: 3.87, percentage: 0.7 },
];

const COLORS = ["#60a5fa", "#a78bfa", "#38bdf8", "#f9a8d4", "#facc15", "#86efac", "#c4b5fd", "#94a3b8"];

const interpolateColor = (start: string, end: string, ratio: number) => {
  const parse = (hex: string) => [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
  const [sr, sg, sb] = parse(start);
  const [er, eg, eb] = parse(end);
  const mix = (from: number, to: number) =>
    Math.round(from + (to - from) * ratio)
      .toString(16)
      .padStart(2, "0");

  return `#${mix(sr, er)}${mix(sg, eg)}${mix(sb, eb)}`;
};

function shortIndustryName(name: string): string {
  if (name.includes("互联网")) return "互联网/软件";
  if (name.includes("汽车")) return "汽车/制造";
  if (name.includes("电子")) return "电子/硬件";
  if (name.includes("金融")) return "金融";
  if (name.includes("传媒")) return "传媒";
  if (name.includes("企业服务")) return "企业咨询";
  if (name.includes("教育")) return "教育培训";
  if (name.includes("其他")) return "其他行业";
  return name.length > 6 ? `${name.slice(0, 6)}...` : name;
}

function makeTreemapRects(data: IndustryDemandDatum[]) {
  const layout = [
    { x: 0, y: 0, width: 315, height: 260 },
    { x: 326, y: 0, width: 170, height: 92 },
    { x: 506, y: 0, width: 168, height: 92 },
    { x: 326, y: 100, width: 122, height: 78 },
    { x: 458, y: 100, width: 106, height: 78 },
    { x: 574, y: 100, width: 100, height: 78 },
    { x: 326, y: 186, width: 168, height: 74 },
    { x: 504, y: 186, width: 170, height: 74 },
  ];

  return data.slice(0, layout.length).map((item, index) => ({
    ...item,
    ...layout[index],
    shortName: shortIndustryName(item.name),
  }));
}

const fallbackData: CompanyAnalysisData = {
  industries: industryData,
  companySizes: companySizeData,
  industrySizeHeatmap: {
    industries: industryData.slice(0, 8).map((item) => item.name),
    sizes: companySizeData.slice(0, 7).map((item) => item.size),
    cells: [],
    maxCount: 0,
  },
  industrySalary: industrySalaryBubble,
};

const treemapRects = [
  { ...industryData[0], x: 0, y: 0, width: 315, height: 260, shortName: "互联网/游戏/软件" },
  { ...industryData[1], x: 326, y: 0, width: 170, height: 92, shortName: "汽车/制造" },
  { ...industryData[7], x: 506, y: 0, width: 168, height: 92, shortName: "其他行业" },
  { ...industryData[2], x: 326, y: 100, width: 122, height: 78, shortName: "电子/硬件" },
  { ...industryData[3], x: 458, y: 100, width: 106, height: 78, shortName: "金融" },
  { ...industryData[4], x: 574, y: 100, width: 100, height: 78, shortName: "传媒" },
  { ...industryData[5], x: 326, y: 186, width: 168, height: 74, shortName: "企业咨询" },
  { ...industryData[6], x: 504, y: 186, width: 170, height: 74, shortName: "教育培训" },
];

export function IndustryPieChart({ data = fallbackData }: CompanyChartProps = {}) {
  const treemapRects = makeTreemapRects(data.industries);

  return (
    <div className="h-[280px]">
      <svg viewBox="0 0 720 300" role="img" className="h-full w-full overflow-visible">
        <g transform="translate(10 12) scale(1)">
        {treemapRects.map((item, index) => (
          <g key={item.name} className="cursor-pointer">
            <title>{`${item.name}：${item.value} 个实习岗位，占比 ${item.percentage}%`}</title>
            <rect x={item.x} y={item.y} width={item.width} height={item.height} rx={8} fill={COLORS[index % COLORS.length]} fillOpacity={0.86} stroke="var(--card)" strokeWidth={4} />
            {item.width > 52 ? (
              <text x={item.x + item.width / 2} y={item.y + 24} textAnchor="middle" className="fill-white text-[12px] font-semibold">
                {item.shortName}
              </text>
            ) : null}
            {(item.width > 80 && item.height > 54) ? (
              <>
                <text x={item.x + item.width / 2} y={item.y + 46} textAnchor="middle" className="fill-white text-[11px] opacity-95">
                  {item.value} 个
                </text>
                <text x={item.x + item.width / 2} y={item.y + 64} textAnchor="middle" className="fill-white text-[11px] opacity-90">
                  {item.percentage}%
                </text>
              </>
            ) : null}
          </g>
        ))}
        </g>
      </svg>
    </div>
  );
}

export function CompanySizeChart({ data = fallbackData }: CompanyChartProps = {}) {
  const companySizeData = data.companySizes;

  return (
    <div className="space-y-3 py-2">
      {companySizeData.map((item, index) => (
        <div key={item.size} title={`${item.size}：${item.count} 个实习岗位，占比 ${item.percentage}%`}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">{item.size}</span>
            <span className="text-muted-foreground">{item.count} 个 · {item.percentage}%</span>
          </div>
          <div className="h-6 overflow-hidden rounded-full bg-muted">
            <div
              className="flex h-full items-center justify-end rounded-full px-2 text-[11px] font-medium text-white transition-all"
              style={{ width: `${Math.max(item.percentage, 5)}%`, backgroundColor: COLORS[index % COLORS.length] }}
            >
              {item.percentage >= 8 ? `${item.percentage}%` : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function heatmapColor(count: number, maxCount: number) {
  if (!count || !maxCount) return "#f8fafc";
  const ratio = Math.sqrt(count / maxCount);
  return interpolateColor("#dbeafe", "#2563eb", ratio);
}

function heatmapPercentageStyle(percentage: number, maxPercentage: number) {
  const intensity = maxPercentage ? percentage / maxPercentage : 0;
  const hue = 48 - intensity * 42;
  const lightness = 88 - intensity * 38;

  return {
    backgroundColor: `hsla(${hue}, 88%, ${lightness}%, ${0.38 + intensity * 0.56})`,
    borderColor: `hsla(${hue}, 84%, ${Math.max(lightness - 12, 34)}%, ${0.3 + intensity * 0.48})`,
    color: intensity > 0.72 ? "#ffffff" : "#0f172a",
  };
}

function shortAxisLabel(name: string, maxLength = 10) {
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
}

function compactSizeLabel(size: string) {
  if (size.includes("少于15")) return "<15";
  if (size.includes("15-50")) return "15-50";
  if (size.includes("50-150")) return "50-150";
  if (size.includes("150-500")) return "150-500";
  if (size.includes("500-2000")) return "500+";
  if (size.includes("2000人以上")) return "2000+";
  if (size.includes("其他") || size.includes("未知")) return "其他";
  return shortAxisLabel(size.replace("人", ""), 7);
}

export function IndustrySizeHeatmapChart({ data = fallbackData }: CompanyChartProps = {}) {
  const heatmap = data.industrySizeHeatmap;

  if (!heatmap.industries.length || !heatmap.sizes.length || !heatmap.cells.length) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 text-center text-sm text-muted-foreground">
        当前数据不足以绘制行业与公司规模实习岗位分布热力图。
      </div>
    );
  }

  const cellMap = new Map(heatmap.cells.map((cell) => [`${cell.industry}|||${cell.size}`, cell.count]));
  const rowTotals = heatmap.industries.map((industry) =>
    heatmap.sizes.reduce((sum, size) => sum + (cellMap.get(`${industry}|||${size}`) ?? 0), 0)
  );
  const percentages = heatmap.industries.flatMap((industry, rowIndex) => {
    const rowTotal = rowTotals[rowIndex] || 1;
    return heatmap.sizes.map((size) => ((cellMap.get(`${industry}|||${size}`) ?? 0) / rowTotal) * 100);
  });
  const maxPercentage = Math.max(...percentages, 1);

  const getPercentage = (industry: string, size: string, rowIndex: number) => {
    const value = cellMap.get(`${industry}|||${size}`) ?? 0;
    const rowTotal = rowTotals[rowIndex] || 1;
    return Number(((value / rowTotal) * 100).toFixed(1));
  };

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_34px] items-center gap-3">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[82px]" />
            {heatmap.sizes.map((size) => (
              <col key={size} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="px-1 py-2 text-left text-[11px] font-medium text-muted-foreground">行业</th>
              {heatmap.sizes.map((size) => (
                <th key={size} className="px-0.5 py-2 text-center text-[10px] font-medium leading-tight text-muted-foreground" title={size}>
                  {compactSizeLabel(size)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.industries.map((industry, rowIndex) => (
              <tr key={industry}>
                <td className="whitespace-nowrap px-1 py-1.5 text-[11px] font-medium text-foreground" title={industry}>
                  {shortAxisLabel(industry, 7)}
                </td>
                {heatmap.sizes.map((size) => {
                  const count = cellMap.get(`${industry}|||${size}`) ?? 0;
                  const percentage = getPercentage(industry, size, rowIndex);

                  return (
                    <td key={`${industry}-${size}`} className="p-0.5">
                      <div
                        title={`${industry} - ${size}：${count} 个实习岗位，占该行业 ${percentage}%`}
                        className="flex h-8 min-w-0 items-center justify-center rounded border text-[10px] font-semibold transition-transform hover:scale-105"
                        style={heatmapPercentageStyle(percentage, maxPercentage)}
                      >
                        {percentage}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
          <span>高</span>
          <div className="relative h-44 w-6">
            <div className="absolute left-1/2 top-0 h-44 w-4 -translate-x-1/2 rounded-full border border-amber-300/70 bg-gradient-to-b from-red-600 via-orange-400 to-yellow-200 shadow-inner" />
          </div>
          <span>低</span>
          <span className="mt-1 text-center leading-3">实习<br />占比</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        红色表示该行业内对应公司规模的实习岗位占比更高，黄色表示占比较低；悬停可查看实习岗位数量和占比。
      </p>
    </div>
  );
}

export function IndustrySalaryChart({ data = fallbackData }: CompanyChartProps = {}) {
  const industrySalaryBubble = data.industrySalary;
  const maxJobs = Math.max(...industrySalaryBubble.map((item) => item.jobs), 1);
  const salaries = industrySalaryBubble.map((item) => item.salary).filter(Boolean);
  const minSalary = Math.max(0, Math.min(...salaries) - 0.4);
  const maxSalary = Math.max(...salaries, 1) + 0.4;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ left: 0, right: 32, top: 24, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" dataKey="jobs" name="实习岗位数量" domain={[0, Math.ceil(maxJobs * 1.12)]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "实习岗位数量", position: "bottom", offset: 0, fontSize: 12, fill: "var(--muted-foreground)" }} />
          <YAxis type="number" dataKey="salary" name="平均实习薪资" domain={[Number(minSalary.toFixed(1)), Number(maxSalary.toFixed(1))]} tickFormatter={(value) => `${value}k`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "平均实习薪资(k)", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--muted-foreground)" }} />
          <ZAxis type="number" dataKey="percentage" range={[80, 900]} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "平均实习薪资") return [`${value}k`, name];
              if (name === "实习岗位数量") return [`${value} 个`, name];
              return [`${value}%`, "行业占比"];
            }}
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
          />
          <Scatter name="行业" data={industrySalaryBubble} fill="#60a5fa" fillOpacity={0.55}>
            {industrySalaryBubble.map((item, index) => (
              <Cell key={item.industry} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
