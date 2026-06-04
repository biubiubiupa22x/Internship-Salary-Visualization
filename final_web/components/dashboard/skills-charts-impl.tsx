"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const skillsRankData = [
  { skill: "Python", count: 856 },
  { skill: "机器学习", count: 678 },
  { skill: "深度学习", count: 589 },
  { skill: "TensorFlow", count: 445 },
  { skill: "PyTorch", count: 423 },
  { skill: "NLP", count: 378 },
  { skill: "数据分析", count: 356 },
  { skill: "计算机视觉", count: 312 },
  { skill: "SQL", count: 289 },
  { skill: "大模型/LLM", count: 267 },
  { skill: "Spark", count: 234 },
  { skill: "Docker", count: 212 },
];

const skillCategoryData = [
  { category: "编程语言", count: 1256 },
  { category: "框架工具", count: 1102 },
  { category: "算法领域", count: 1957 },
  { category: "工程能力", count: 567 },
];

export function SkillsRankChart() {
  return (
    <div className="h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skillsRankData} layout="vertical" margin={{ left: 0, right: 54 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="skill" width={90} tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`出现 ${value} 次`, "频次"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="count" position="right" className="fill-foreground" fontSize={12} />
            {skillsRankData.map((_, index) => <Cell key={index} fill={index < 3 ? "var(--chart-1)" : index < 6 ? "var(--chart-2)" : "var(--chart-3)"} fillOpacity={Math.max(0.4, 1 - index * 0.04)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillsWordCloud() {
  const words = skillsRankData.map((item) => ({ text: item.skill, size: 16 + (item.count / 856) * 32 }));
  return (
    <div className="relative h-[280px] overflow-hidden rounded-lg bg-gradient-to-br from-purple-50/50 to-blue-50/50 p-4">
      <div className="flex h-full flex-wrap items-center justify-center gap-3">
        {words.map((word, index) => (
          <span key={word.text} title={`${word.text}：${skillsRankData[index].count} 次`} className="cursor-default transition-transform hover:scale-110" style={{ fontSize: `${word.size}px`, color: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"][index % 4], fontWeight: word.size > 30 ? 700 : 600 }}>
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillCategoryChart() {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skillCategoryData} margin={{ left: -10, right: 10, top: 20 }}>
          <XAxis dataKey="category" tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value} 次提及`, "总频次"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="count" position="top" className="fill-foreground" fontSize={12} />
            {skillCategoryData.map((_, index) => <Cell key={index} fill={["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"][index]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillCooccurrence() {
  const skills = ["Python", "ML", "DL", "TF", "PT", "NLP"];
  const matrix = [
    [100, 85, 82, 65, 62, 55],
    [85, 100, 78, 58, 56, 48],
    [82, 78, 100, 72, 75, 52],
    [65, 58, 72, 100, 35, 45],
    [62, 56, 75, 35, 100, 48],
    [55, 48, 52, 45, 48, 100],
  ];
  const getColor = (value: number) => value >= 75 ? "bg-purple-500 text-white" : value >= 60 ? "bg-purple-400 text-white" : "bg-purple-200 text-purple-900";

  return (
    <div className="h-[280px] flex flex-col items-center justify-center">
      <div className="grid gap-1">
        <div className="flex gap-1">
          <div className="h-8 w-12" />
          {skills.map((skill) => <div key={skill} className="flex h-8 w-10 items-center justify-center text-xs font-medium text-foreground">{skill}</div>)}
        </div>
        {skills.map((rowSkill, rowIndex) => (
          <div key={rowSkill} className="flex gap-1">
            <div className="flex h-10 w-12 items-center justify-start text-xs font-medium text-foreground">{rowSkill}</div>
            {matrix[rowIndex].map((value, colIndex) => <div key={colIndex} title={`${rowSkill} & ${skills[colIndex]}: ${value}%`} className={`flex h-10 w-10 items-center justify-center rounded text-xs font-medium ${getColor(value)}`}>{value}</div>)}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">热力图用于看整体共现强度，具体组合可悬停查看。</p>
    </div>
  );
}
