"use client";

import { Bar, BarChart, Cell, LabelList, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const positionTypeData = [
  { type: "算法工程师", count: 356, percentage: 28.8 },
  { type: "机器学习工程师", count: 245, percentage: 19.8 },
  { type: "数据科学家", count: 189, percentage: 15.3 },
  { type: "NLP工程师", count: 156, percentage: 12.6 },
  { type: "CV工程师", count: 134, percentage: 10.8 },
  { type: "AI产品经理", count: 89, percentage: 7.2 },
  { type: "其他", count: 67, percentage: 5.5 },
];

const positionSalaryData = [
  { type: "算法工程师", salary: 18.5 },
  { type: "数据科学家", salary: 20.2 },
  { type: "NLP工程师", salary: 19.8 },
  { type: "CV工程师", salary: 18.2 },
  { type: "ML工程师", salary: 17.5 },
  { type: "AI产品经理", salary: 22.5 },
];

const positionSkillRadar = [
  { skill: "Python", 算法: 90, NLP: 85, CV: 88 },
  { skill: "深度学习", 算法: 85, NLP: 80, CV: 92 },
  { skill: "机器学习", 算法: 88, NLP: 75, CV: 78 },
  { skill: "数据分析", 算法: 70, NLP: 65, CV: 60 },
  { skill: "工程能力", 算法: 75, NLP: 72, CV: 75 },
  { skill: "领域知识", 算法: 60, NLP: 85, CV: 88 },
];

const llmPositions = [
  { type: "大模型算法", count: 89, growth: "+156%" },
  { type: "Prompt工程师", count: 67, growth: "+245%" },
  { type: "AIGC应用开发", count: 56, growth: "+189%" },
  { type: "模型训练工程师", count: 45, growth: "+123%" },
];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)", "var(--chart-2)"];

export function PositionTypePie() {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={positionTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="count" nameKey="type" label={({ percentage }) => `${percentage}%`} labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}>
            {positionTypeData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(value: number, _name, props) => [`${value} 个岗位，占比 ${props.payload.percentage}%`, props.payload.type]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PositionSalaryChart() {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={positionSalaryData} layout="vertical" margin={{ left: 10, right: 58 }}>
          <XAxis type="number" domain={[0, 25]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="type" width={85} tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value}k`, "平均实习薪资"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          <Bar dataKey="salary" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="salary" position="right" formatter={(value: number) => `${value}k`} className="fill-foreground" fontSize={12} />
            {positionSalaryData.map((entry, index) => <Cell key={index} fill={entry.salary >= 20 ? "var(--chart-1)" : "var(--chart-3)"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PositionSkillRadar() {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={positionSkillRadar}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "var(--foreground)" }} />
          <Radar name="算法工程师" dataKey="算法" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
          <Radar name="NLP工程师" dataKey="NLP" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.3} />
          <Radar name="CV工程师" dataKey="CV" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.3} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LLMPositionsChart() {
  return (
    <div className="h-[280px] flex flex-col justify-center">
      <div className="space-y-4">
        {llmPositions.map((pos) => (
          <div key={pos.type} className="flex items-center gap-4">
            <div className="w-28 text-sm font-medium text-foreground">{pos.type}</div>
            <div className="flex-1">
              <div className="relative h-8 overflow-hidden rounded-full bg-secondary" title={`${pos.type}：${pos.count} 个岗位，增长 ${pos.growth}`}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" style={{ width: `${(pos.count / 89) * 100}%` }} />
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-xs font-medium text-white">{pos.count} 个岗位</span>
                  <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs font-bold text-green-600">{pos.growth}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        大模型相关新岗位中，Prompt 工程师增长最突出。
      </p>
    </div>
  );
}
