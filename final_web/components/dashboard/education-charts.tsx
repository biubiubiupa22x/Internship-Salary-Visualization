"use client";

import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

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

const competitivenessData: ScatterDatum[] = [
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 3.85, score: 0.41, sampleCount: 692, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 4.95, score: 0.47, sampleCount: 553, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 3.3, score: 0.38, sampleCount: 443, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 4.4, score: 0.44, sampleCount: 405, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 2.95, score: 0.36, sampleCount: 334, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 3.65, score: 0.4, sampleCount: 329, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 7.7, score: 0.62, sampleCount: 324, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 5.5, score: 0.5, sampleCount: 317, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 2.75, score: 0.35, sampleCount: 275, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 2.4, score: 0.33, sampleCount: 252, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 4.2, score: 0.43, sampleCount: 245, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 6.05, score: 0.53, sampleCount: 146, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 3.85, score: 0.61, sampleCount: 143, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 6.6, score: 0.56, sampleCount: 140, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 2.2, score: 0.32, sampleCount: 139, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 4.75, score: 0.46, sampleCount: 127, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 3.3, score: 0.58, sampleCount: 103, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 2.6, score: 0.34, sampleCount: 102, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 4.95, score: 0.37, sampleCount: 98, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 2.95, score: 0.56, sampleCount: 88, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 5.5, score: 0.4, sampleCount: 88, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 3.5, score: 0.39, sampleCount: 72, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 2.75, score: 0.55, sampleCount: 70, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 7.15, score: 0.59, sampleCount: 67, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 3.85, score: 0.31, sampleCount: 62, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 4.95, score: 0.67, sampleCount: 62, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 7.7, score: 0.52, sampleCount: 61, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 8.8, score: 0.68, sampleCount: 57, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 3.65, score: 0.6, sampleCount: 55, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 2.2, score: 0.52, sampleCount: 54, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 2, score: 0.31, sampleCount: 54, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 11, score: 0.8, sampleCount: 54, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 2.4, score: 0.53, sampleCount: 53, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 6.05, score: 0.43, sampleCount: 52, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 4.4, score: 0.34, sampleCount: 52, skillCount: null },
  { jobTitle: "大专岗位样本", education: "大专", experience: "不限", salary: 3.85, score: 0.51, sampleCount: 52, skillCount: null },
  { jobTitle: "大专岗位样本", education: "大专", experience: "不限", salary: 2.75, score: 0.45, sampleCount: 52, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 4.4, score: 0.64, sampleCount: 51, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 8.8, score: 0.58, sampleCount: 45, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 5.5, score: 0.7, sampleCount: 43, skillCount: null },
  { jobTitle: "大专岗位样本", education: "大专", experience: "不限", salary: 2.95, score: 0.46, sampleCount: 41, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 1.1, score: 0.26, sampleCount: 40, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 3.3, score: 0.28, sampleCount: 37, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 6.6, score: 0.46, sampleCount: 35, skillCount: null },
  { jobTitle: "硕士岗位样本", education: "硕士", experience: "不限", salary: 7.15, score: 0.49, sampleCount: 35, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 3.5, score: 0.59, sampleCount: 34, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 6.6, score: 0.56, sampleCount: 31, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 2.6, score: 0.54, sampleCount: 31, skillCount: null },
  { jobTitle: "不限岗位样本", education: "不限", experience: "不限", salary: 4.2, score: 0.63, sampleCount: 30, skillCount: null },
  { jobTitle: "本科岗位样本", education: "本科", experience: "不限", salary: 1.65, score: 0.29, sampleCount: 29, skillCount: null },
];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const EDUCATION_ROSE_COLORS = ["#93c5fd", "#bfdbfe", "#60a5fa", "#dbeafe", "#a7d8ff"];
const educationColors: Record<string, string> = { 本科: "#60a5fa", 硕士: "#a78bfa", 大专: "#38bdf8", 博士: "#f9a8d4", 不限: "#94a3b8" };

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

export function EducationPieChart() {
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
              <title>{`${item.level}：${item.count} 个岗位，占比 ${item.percentage}%`}</title>
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

export function EducationSalaryChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={eduSalaryData} margin={{ left: -10, right: 20, top: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="level" tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 35]} tickFormatter={(v) => `${v}k`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value}k`, name === "trendSalary" ? "薪资趋势" : "平均薪资"]}
            contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
          />
          <Bar dataKey="salary" name="平均薪资" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="salary" position="top" formatter={(value: number) => `${value}k`} className="fill-foreground" fontSize={12} />
            {eduSalaryData.map((_, index) => (
              <Cell
                key={index}
                fill={interpolateColor("#f9a8d4", "#a78bfa", index / Math.max(eduSalaryData.length - 1, 1))}
              />
            ))}
          </Bar>
          <Line type="monotone" dataKey="trendSalary" name="薪资趋势" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#c4b5fd", stroke: "#7c3aed", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExperienceBarChart() {
  const width = 620;
  const height = 330;
  const leftX = 86;
  const rightX = 470;
  const top = 42;
  const rowGap = 48;
  const maxLink = Math.max(...salaryFlowLinks.map((link) => link.value));
  const sources = ["本科", "不限", "硕士", "大专", "博士"];
  const targets = ["3k以下", "3-6k", "6-10k", "10-15k"];
  const sourceTotals = Object.fromEntries(
    sources.map((source) => [source, salaryFlowLinks.filter((link) => link.source === source).reduce((sum, link) => sum + link.value, 0)])
  );
  const targetTotals = Object.fromEntries(
    targets.map((target) => [target, salaryFlowLinks.filter((link) => link.target === target).reduce((sum, link) => sum + link.value, 0)])
  );
  const sourceY = Object.fromEntries(sources.map((source, index) => [source, top + index * rowGap]));
  const targetY = Object.fromEntries(targets.map((target, index) => [target, top + 20 + index * 58]));
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
        <text x={rightX} y={20} textAnchor="middle" className="fill-muted-foreground text-[12px]">薪资档位</text>
        {salaryFlowLinks.map((link) => {
          const y1 = sourceY[link.source] + 8;
          const y2 = targetY[link.target] + 8;
          const path = `M ${leftX + 58} ${y1} C ${leftX + 190} ${y1}, ${rightX - 190} ${y2}, ${rightX - 58} ${y2}`;

          return (
            <path key={`${link.source}-${link.target}`} d={path} fill="none" stroke="url(#education-flow-gradient)" strokeWidth={linkWidth(link.value)} strokeOpacity={0.26} className="cursor-pointer transition-opacity hover:opacity-80">
              <title>{`${link.source} → ${link.target}：${link.value} 个岗位`}</title>
            </path>
          );
        })}
        {sources.map((source) => (
          <g key={source} className="cursor-pointer">
            <title>{`${source}：${sourceTotals[source]} 个岗位`}</title>
            <rect x={leftX - 48} y={sourceY[source] - 6} width={96} height={28} rx={6} fill={educationColors[source]} fillOpacity={0.9} />
            <text x={leftX} y={sourceY[source] + 5} textAnchor="middle" className="fill-white text-[12px] font-medium">{source}</text>
            <text x={leftX} y={sourceY[source] + 19} textAnchor="middle" className="fill-white text-[10px] opacity-90">{sourceTotals[source]} 个</text>
          </g>
        ))}
        {targets.map((target) => (
          <g key={target} className="cursor-pointer">
            <title>{`${target}：${targetTotals[target]} 个岗位`}</title>
            <rect x={rightX - 52} y={targetY[target] - 6} width={104} height={30} rx={6} fill="#c4b5fd" fillOpacity={0.92} />
            <text x={rightX} y={targetY[target] + 6} textAnchor="middle" className="fill-foreground text-[12px] font-medium">{target}</text>
            <text x={rightX} y={targetY[target] + 20} textAnchor="middle" className="fill-muted-foreground text-[10px]">{targetTotals[target]} 个</text>
          </g>
        ))}
        <text x={width / 2} y={height - 16} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          经验字段均为“不限”，因此本图按学历要求到薪资档位进行简化流向分析
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
      <p className="text-muted-foreground">技能数量：数据未提供</p>
      <p className="text-muted-foreground">竞争力评分：{item.score}</p>
      <p className="text-muted-foreground">薪资：{item.salary}k</p>
      <p className="text-muted-foreground">样本数：{item.sampleCount} 个岗位</p>
    </div>
  );
}

export function CompetitivenessScatterChart() {
  const groupedData = Object.fromEntries(
    Object.keys(educationColors).map((education) => [education, competitivenessData.filter((item) => item.education === education)])
  );

  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ left: 0, right: 90, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" dataKey="score" name="竞争力评分" domain={[0.2, 0.9]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "竞争力评分", position: "bottom", offset: 0, fontSize: 12, fill: "var(--muted-foreground)" }} />
          <YAxis type="number" dataKey="salary" name="薪资" domain={[0, 12]} tickFormatter={(v) => `${v}k`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "薪资水平(k)", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--muted-foreground)" }} />
          <ZAxis range={[70, 70]} />
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
