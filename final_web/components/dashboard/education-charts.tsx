"use client";

import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import type { EducationAnalysisData } from "@/lib/education-data";

type EducationChartProps = {
  data?: EducationAnalysisData;
};

const educationData = [
  { level: "博士", count: 45, percentage: 3.6 },
  { level: "硕士", count: 389, percentage: 31.5 },
  { level: "本科", count: 698, percentage: 56.5 },
  { level: "大专", count: 89, percentage: 7.2 },
  { level: "不限", count: 15, percentage: 1.2 },
];

const salaryFlowLinks = [
  { source: "本科", target: "3-6k", value: 3509 },
  { source: "本科", target: "3k以下", value: 1305 },
  { source: "本科", target: "6-10k", value: 815 },
  { source: "不限", target: "3-6k", value: 693 },
  { source: "硕士", target: "3-6k", value: 474 },
  { source: "不限", target: "3k以下", value: 395 },
  { source: "硕士", target: "6-10k", value: 282 },
  { source: "大专", target: "3-6k", value: 217 },
  { source: "大专", target: "3k以下", value: 182 },
  { source: "硕士", target: "3k以下", value: 108 },
  { source: "不限", target: "6-10k", value: 96 },
  { source: "本科", target: "10-15k", value: 54 },
  { source: "大专", target: "6-10k", value: 7 },
  { source: "博士", target: "6-10k", value: 5 },
  { source: "硕士", target: "10-15k", value: 4 },
  { source: "博士", target: "3-6k", value: 2 },
  { source: "博士", target: "3k以下", value: 1 },
];

const eduSalaryData = [
  { level: "不限", salary: 10.5, trendSalary: 10.5 },
  { level: "大专", salary: 12.5, trendSalary: 12.5 },
  { level: "本科", salary: 16.2, trendSalary: 16.2 },
  { level: "硕士", salary: 21.5, trendSalary: 21.5 },
  { level: "博士", salary: 28.8, trendSalary: 28.8 },
];

type ScatterDatum = {
  jobTitle: string;
  education: string;
  experience: string;
  salary: number;
  score: number;
  sampleCount: number;
  skillCount: number | null;
};

const competitivenessData: ScatterDatum[] = [];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const EDUCATION_ROSE_COLORS = ["#93c5fd", "#bfdbfe", "#60a5fa", "#dbeafe", "#a7d8ff"];
const educationColors: Record<string, string> = { 本科: "#60a5fa", 硕士: "#a78bfa", 大专: "#38bdf8", 博士: "#f9a8d4", 不限: "#94a3b8" };

const fallbackData: EducationAnalysisData = {
  distribution: educationData.map((item) => ({
    name: item.level,
    value: item.count,
    percentage: item.percentage,
  })),
  salary: eduSalaryData.map((item) => ({
    education: item.level,
    salary: item.salary,
    trend: item.trendSalary,
  })),
  flowLinks: salaryFlowLinks,
  competitiveness: competitivenessData.map((item) => ({
    title: item.jobTitle,
    education: item.education,
    experience: item.experience,
    skills: item.skillCount ?? 0,
    score: item.score,
    salary: item.salary,
  })),
};

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

const polarPoint = (cx: number, cy: number, radius: number, angle: number) => {
  const radian = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radian),
    y: cy + radius * Math.sin(radian),
  };
};

const roseSectorPath = (cx: number, cy: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const outerStart = polarPoint(cx, cy, outerRadius, startAngle);
  const outerEnd = polarPoint(cx, cy, outerRadius, endAngle);
  const innerEnd = polarPoint(cx, cy, innerRadius, endAngle);
  const innerStart = polarPoint(cx, cy, innerRadius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

export function EducationPieChart({ data = fallbackData }: EducationChartProps = {}) {
  const educationData = data.distribution.map((item) => ({
    level: item.name,
    count: item.value,
    percentage: item.percentage,
  }));
  const maxCount = Math.max(...educationData.map((item) => item.count));
  const width = 520;
  const height = 300;
  const cx = 235;
  const cy = 145;
  const innerRadius = 24;
  const maxRadius = 112;
  const angleStep = 360 / educationData.length;

  return (
    <div className="h-[300px]">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" className="h-full w-full overflow-visible">
        {[35, 60, 85, 110].map((radius) => (
          <circle key={radius} cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeDasharray="3 4" />
        ))}
        {educationData.map((item, index) => {
          const startAngle = index * angleStep + 2;
          const endAngle = (index + 1) * angleStep - 2;
          const radius = innerRadius + Math.sqrt(item.count / maxCount) * (maxRadius - innerRadius);
          const labelPoint = polarPoint(cx, cy, radius + 18, startAngle + angleStep / 2);

          return (
            <g key={item.level} className="cursor-pointer">
              <title>{`${item.level}：${item.count} 个实习岗位，占比 ${item.percentage}%`}</title>
              <path d={roseSectorPath(cx, cy, innerRadius, radius, startAngle, endAngle)} fill={EDUCATION_ROSE_COLORS[index % EDUCATION_ROSE_COLORS.length]} fillOpacity={0.86} stroke="var(--card)" strokeWidth={2} />
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[11px] font-medium">
                {item.percentage}%
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={innerRadius - 2} fill="var(--card)" stroke="var(--border)" />
        <text x={cx} y={cy - 2} textAnchor="middle" className="fill-foreground text-[12px] font-semibold">学历</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-muted-foreground text-[10px]">要求</text>
        <g transform="translate(382 74)">
          {educationData.map((item, index) => (
            <g key={item.level} transform={`translate(0 ${index * 28})`}>
              <rect width={10} height={10} rx={2} fill={EDUCATION_ROSE_COLORS[index % EDUCATION_ROSE_COLORS.length]} />
              <text x={18} y={9} className="fill-foreground text-[12px]">{item.level}</text>
              <text x={62} y={9} className="fill-muted-foreground text-[12px]">{item.count}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export function EducationSalaryChart({ data = fallbackData }: EducationChartProps = {}) {
  const eduSalaryData = data.salary.map((item) => ({
    level: item.education,
    salary: item.salary,
    trendSalary: item.trend,
  }));
  const salaryMax = Math.max(...eduSalaryData.map((item) => item.salary), 10);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={eduSalaryData} margin={{ left: -10, right: 20, top: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="level" tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, Math.ceil(salaryMax * 1.25)]} tickFormatter={(v) => `${v}k`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value}k`, name === "trendSalary" ? "实习薪资趋势" : "平均实习薪资"]}
            contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
          />
          <Bar dataKey="salary" name="平均实习薪资" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="salary" position="top" formatter={(value: number) => `${value}k`} className="fill-foreground" fontSize={12} />
            {eduSalaryData.map((_, index) => (
              <Cell
                key={index}
                fill={interpolateColor("#f9a8d4", "#a78bfa", index / Math.max(eduSalaryData.length - 1, 1))}
              />
            ))}
          </Bar>
          <Line type="monotone" dataKey="trendSalary" name="实习薪资趋势" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#c4b5fd", stroke: "#7c3aed", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExperienceBarChart({ data = fallbackData }: EducationChartProps = {}) {
  const salaryFlowLinks = data.flowLinks;
  const width = 620;
  const height = 330;
  const leftX = 86;
  const rightX = 470;
  const top = 42;
  const maxLink = Math.max(...salaryFlowLinks.map((link) => link.value), 1);
  const sources = Array.from(new Set(salaryFlowLinks.map((link) => link.source)));
  const targets = Array.from(new Set(salaryFlowLinks.map((link) => link.target)));
  const sourceGap = Math.min(48, 230 / Math.max(sources.length - 1, 1));
  const targetGap = Math.min(46, 220 / Math.max(targets.length - 1, 1));
  const sourceTotals = Object.fromEntries(
    sources.map((source) => [source, salaryFlowLinks.filter((link) => link.source === source).reduce((sum, link) => sum + link.value, 0)])
  );
  const targetTotals = Object.fromEntries(
    targets.map((target) => [target, salaryFlowLinks.filter((link) => link.target === target).reduce((sum, link) => sum + link.value, 0)])
  );
  const sourceY = Object.fromEntries(sources.map((source, index) => [source, top + index * sourceGap]));
  const targetY = Object.fromEntries(targets.map((target, index) => [target, top + 8 + index * targetGap]));
  const linkWidth = (value: number) => Math.max(2, Math.sqrt(value / maxLink) * 22);

  return (
    <div className="h-[330px]">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="education-flow-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <text x={leftX} y={20} textAnchor="middle" className="fill-muted-foreground text-[12px]">学历要求</text>
        <text x={rightX} y={20} textAnchor="middle" className="fill-muted-foreground text-[12px]">实习薪资档位</text>
        {salaryFlowLinks.map((link) => {
          const y1 = sourceY[link.source] + 8;
          const y2 = targetY[link.target] + 8;
          const path = `M ${leftX + 58} ${y1} C ${leftX + 190} ${y1}, ${rightX - 190} ${y2}, ${rightX - 58} ${y2}`;

          return (
            <path key={`${link.source}-${link.target}`} d={path} fill="none" stroke="url(#education-flow-gradient)" strokeWidth={linkWidth(link.value)} strokeOpacity={0.26} className="cursor-pointer transition-opacity hover:opacity-80">
              <title>{`${link.source} → ${link.target}：${link.value} 个实习岗位`}</title>
            </path>
          );
        })}
        {sources.map((source) => (
          <g key={source} className="cursor-pointer">
            <title>{`${source}：${sourceTotals[source]} 个实习岗位`}</title>
            <rect x={leftX - 48} y={sourceY[source] - 6} width={96} height={28} rx={6} fill={educationColors[source]} fillOpacity={0.9} />
            <text x={leftX} y={sourceY[source] + 5} textAnchor="middle" className="fill-white text-[12px] font-medium">{source}</text>
            <text x={leftX} y={sourceY[source] + 19} textAnchor="middle" className="fill-white text-[10px] opacity-90">{sourceTotals[source]} 个</text>
          </g>
        ))}
        {targets.map((target) => (
          <g key={target} className="cursor-pointer">
            <title>{`${target}：${targetTotals[target]} 个实习岗位`}</title>
            <rect x={rightX - 52} y={targetY[target] - 6} width={104} height={30} rx={6} fill="#c4b5fd" fillOpacity={0.92} />
            <text x={rightX} y={targetY[target] + 6} textAnchor="middle" className="fill-foreground text-[12px] font-medium">{target}</text>
            <text x={rightX} y={targetY[target] + 20} textAnchor="middle" className="fill-muted-foreground text-[10px]">{targetTotals[target]} 个</text>
          </g>
        ))}
        <text x={width / 2} y={height - 16} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          经验字段均为“不限”，因此本图按学历要求到实习薪资档位进行简化流向分析
        </text>
      </svg>
    </div>
  );
}

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ScatterDatum }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{item.jobTitle}</p>
      <p className="mt-1 text-muted-foreground">学历要求：{item.education}</p>
      <p className="text-muted-foreground">经验要求：{item.experience}</p>
      <p className="text-muted-foreground">技能数量：{item.skillCount ?? 0}</p>
      <p className="text-muted-foreground">竞争力评分：{item.score}</p>
      <p className="text-muted-foreground">实习薪资：{item.salary}k</p>
      <p className="text-muted-foreground">样本数：{item.sampleCount} 个实习岗位</p>
    </div>
  );
}

export function CompetitivenessScatterChart({ data = fallbackData }: EducationChartProps = {}) {
  const competitivenessData: ScatterDatum[] = data.competitiveness.map((item) => ({
    jobTitle: item.title,
    education: item.education,
    experience: item.experience,
    salary: item.salary,
    score: item.score,
    sampleCount: 1,
    skillCount: item.skills,
  }));
  const groupedData = Object.fromEntries(
    Object.keys(educationColors).map((education) => [education, competitivenessData.filter((item) => item.education === education)])
  );
  const scoreValues = competitivenessData.map((item) => item.score);
  const salaryValues = competitivenessData.map((item) => item.salary);
  const minScore = Math.max(0, Math.min(...scoreValues, 0.2) - 0.1);
  const maxScore = Math.max(...scoreValues, 0.9) + 0.1;
  const maxSalary = Math.max(...salaryValues, 10);

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ left: 0, right: 90, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" dataKey="score" name="竞争力评分" domain={[Number(minScore.toFixed(1)), Number(maxScore.toFixed(1))]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "竞争力评分", position: "bottom", offset: 0, fontSize: 12, fill: "var(--muted-foreground)" }} />
          <YAxis type="number" dataKey="salary" name="实习薪资" domain={[0, Math.ceil(maxSalary * 1.15)]} tickFormatter={(v) => `${v}k`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "实习薪资水平(k)", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--muted-foreground)" }} />
          <ZAxis type="number" dataKey="skillCount" range={[55, 150]} />
          <Tooltip content={<ScatterTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingLeft: 12 }}
          />
          {Object.entries(groupedData).map(([education, rows]) => (
            <Scatter key={education} name={education} data={rows} fill={educationColors[education]} fillOpacity={0.62} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        散点图使用清洗数据聚合样本，颜色区分学历要求；技能数量字段未提供，因此气泡大小保持一致。
      </p>
    </div>
  );
}
