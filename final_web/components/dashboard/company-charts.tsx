"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

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

const topCompanies = [
  { name: "字节跳动", jobs: 68 },
  { name: "阿里巴巴", jobs: 56 },
  { name: "腾讯", jobs: 52 },
  { name: "百度", jobs: 48 },
  { name: "华为", jobs: 45 },
  { name: "美团", jobs: 38 },
  { name: "京东", jobs: 35 },
  { name: "小米", jobs: 32 },
  { name: "网易", jobs: 28 },
  { name: "滴滴", jobs: 25 },
  { name: "快手", jobs: 22 },
  { name: "科大讯飞", jobs: 20 },
  { name: "商汤科技", jobs: 18 },
  { name: "旷视科技", jobs: 16 },
  { name: "拼多多", jobs: 15 },
];

const topCompanyTotal = topCompanies.reduce((sum, item) => sum + item.jobs, 0);
let topCompanyCumulative = 0;
const paretoCompanies = topCompanies.map((item) => {
  topCompanyCumulative += item.jobs;
  return {
    ...item,
    cumulative: Number(((topCompanyCumulative / topCompanyTotal) * 100).toFixed(1)),
  };
});

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

export function IndustryPieChart() {
  return (
    <div className="h-[280px]">
      <svg viewBox="0 0 720 300" role="img" className="h-full w-full overflow-visible">
        <g transform="translate(10 12) scale(1)">
        {treemapRects.map((item, index) => (
          <g key={item.name} className="cursor-pointer">
            <title>{`${item.name}：${item.value} 个岗位，占比 ${item.percentage}%`}</title>
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

export function CompanySizeChart() {
  return (
    <div className="space-y-3 py-2">
      {companySizeData.map((item, index) => (
        <div key={item.size} title={`${item.size}：${item.count} 个岗位，占比 ${item.percentage}%`}>
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

export function TopCompaniesChart() {
  const keyPoint = paretoCompanies.find((item) => item.cumulative >= 80) ?? paretoCompanies[0];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={paretoCompanies} margin={{ left: -10, right: 18, bottom: 42, top: 18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={58} tick={{ fontSize: 10, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number, name: string) => name === "cumulative" ? [`${value}%`, "累计占比"] : [`${value} 个岗位`, "岗位数量"]}
            contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }}
          />
          <Bar yAxisId="left" dataKey="jobs" name="岗位数量" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="jobs" position="top" className="fill-foreground" fontSize={11} />
            {paretoCompanies.map((_, index) => <Cell key={index} fill={index < 3 ? "#60a5fa" : "#bfdbfe"} />)}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="cumulative" name="累计占比" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#c4b5fd", r: 4 }} />
          <ReferenceDot yAxisId="right" x={keyPoint.name} y={keyPoint.cumulative} r={6} fill="#8b5cf6" stroke="white" label={{ value: "超过80%", position: "top", fill: "var(--foreground)", fontSize: 12 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IndustrySalaryChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ left: 0, right: 32, top: 24, bottom: 28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" dataKey="jobs" name="岗位数量" domain={[0, 5000]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "岗位数量", position: "bottom", offset: 0, fontSize: 12, fill: "var(--muted-foreground)" }} />
          <YAxis type="number" dataKey="salary" name="平均薪资" domain={[2.5, 5.2]} tickFormatter={(value) => `${value}k`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} label={{ value: "平均薪资(k)", angle: -90, position: "insideLeft", fontSize: 12, fill: "var(--muted-foreground)" }} />
          <ZAxis type="number" dataKey="percentage" range={[80, 900]} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "平均薪资") return [`${value}k`, name];
              if (name === "岗位数量") return [`${value} 个`, name];
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
