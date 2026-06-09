"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { SkillDatum, SkillLinkDatum, SkillNodeDatum, SkillWordDatum } from "@/lib/skill-data";

export function SkillFrequencyChart({ data }: { data: SkillDatum[] }) {
  return (
    <div className="h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 54 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="skill" width={90} tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`出现 ${value} 次`, "频次"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="count" position="right" className="fill-foreground" fontSize={12} />
            {data.map((_, index) => <Cell key={index} fill={index < 3 ? "var(--chart-1)" : index < 6 ? "var(--chart-2)" : "var(--chart-3)"} fillOpacity={Math.max(0.4, 1 - index * 0.04)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillWordCloud({ data }: { data: SkillWordDatum[] }) {
  const colors: Record<string, string[]> = {
    lang: ["#2563eb", "#0ea5e9", "#0891b2"],
    algo: ["#7c3aed", "#9333ea", "#c026d3"],
    framework: ["#14b8a6", "#22c55e", "#84cc16"],
    domain: ["#f59e0b", "#f97316", "#fb7185"],
    tool: ["#64748b", "#06b6d4", "#10b981"],
    skill: ["#ec4899", "#a855f7", "#38bdf8"],
  };
  return (
    <div className="relative h-[300px] overflow-hidden rounded-xl bg-gradient-to-br from-purple-950/20 via-violet-900/10 to-blue-950/20 p-4">
      <div className="relative h-full">
        {data.map((word, index) => {
          const maxValue = Math.max(...data.map((item) => item.value), 1);
          const minValue = Math.min(...data.map((item) => item.value), 0);
          const weight = (word.value - minValue) / Math.max(maxValue - minValue, 1);
          const size = 13 + Math.pow(Math.max(weight, 0), 1.18) * 46;
          const palette = colors[word.category] ?? colors.skill;
          const color = palette[index % palette.length];
          return (
            <span
              key={word.text}
              title={`${word.text}：${word.value} 次`}
              className="absolute cursor-default whitespace-nowrap transition-all duration-300 hover:z-10 hover:scale-110"
              style={{
                left: `${word.x}%`,
                top: `${word.y}%`,
                transform: "translate(-50%, -50%)",
                fontSize: `${size}px`,
                color,
                fontWeight: size > 30 ? 700 : size > 20 ? 600 : 500,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function SkillHeatmap({ skills, matrix }: { skills: string[]; matrix: number[][] }) {
  const values = matrix.flat();
  const maxValue = Math.max(...values, 1);
  const sortedValues = values.filter((value) => value > 0).sort((a, b) => a - b);
  const labelThreshold = sortedValues[Math.floor(sortedValues.length * 0.85)] ?? maxValue;

  const getCellStyle = (value: number) => {
    const intensity = Math.pow(value / maxValue, 0.62);
    const lightness = 96 - intensity * 54;
    const saturation = 48 + intensity * 24;
    const textColor = lightness < 58 ? "#ffffff" : "#0f172a";

    return {
      backgroundColor: value === 0 ? "#f8fafc" : `hsl(166, ${saturation}%, ${lightness}%)`,
      color: value === 0 ? "#94a3b8" : textColor,
    };
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex gap-0.5">
            <div className="h-9 w-16" />
            {skills.map((skill) => <div key={skill} className="flex h-9 w-12 items-center justify-center text-xs font-semibold text-foreground">{skill}</div>)}
          </div>
          {skills.map((rowSkill, rowIndex) => (
            <div key={rowSkill} className="flex gap-0.5">
              <div className="flex h-11 w-16 items-center justify-start text-xs font-semibold text-foreground">{rowSkill}</div>
              {matrix[rowIndex].map((value, colIndex) => (
                <div
                  key={colIndex}
                  title={rowSkill === skills[colIndex] ? `${rowSkill}: 出现 ${value} 次` : `${rowSkill} + ${skills[colIndex]}: 共现 ${value} 次`}
                  className="flex h-11 w-12 items-center justify-center rounded-sm text-[11px] font-medium transition-transform hover:scale-110"
                  style={getCellStyle(value)}
                >
                  {value >= labelThreshold ? value : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">矩阵值表示技能共同出现次数，对角线为单技能出现频率；默认仅标注高共现单元，完整数值可悬停查看。</p>
    </div>
  );
}

export function SkillNetworkGraph({ nodes, links }: { nodes: SkillNodeDatum[]; links: SkillLinkDatum[] }) {
  const groupColors: Record<number, string> = { 1: "#8b5cf6", 2: "#a855f7", 3: "#7c3aed", 4: "#6366f1", 5: "#818cf8" };
  const getNode = (id: string) => nodes.find((node) => node.id === id);
  const maxNodeValue = Math.max(...nodes.map((node) => node.value), 1);
  const linkWeights = links.map((link) => Math.log1p(link.value));
  const minLinkWeight = Math.min(...linkWeights, 0);
  const maxLinkWeight = Math.max(...linkWeights, 1);

  const getLinkWeight = (value: number) => {
    if (maxLinkWeight === minLinkWeight) return 0.5;
    return (Math.log1p(value) - minLinkWeight) / (maxLinkWeight - minLinkWeight);
  };

  return (
    <div className="relative flex h-[420px] flex-col overflow-hidden rounded-xl bg-gradient-to-br from-slate-950/40 via-purple-950/20 to-slate-950/40 px-2 pb-4 pt-2">
      <svg width="100%" height="360" viewBox="0 0 500 360" className="relative z-10 shrink-0">
        {links.map((link) => {
          const source = getNode(link.source);
          const target = getNode(link.target);
          if (!source || !target) return null;
          const weight = getLinkWeight(link.value);
          return (
            <line key={`${link.source}-${link.target}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#a855f7" strokeWidth={1.2 + weight * 6.2} opacity={0.22 + weight * 0.58}>
              <title>{`${link.source} + ${link.target}：共现 ${link.value} 次`}</title>
            </line>
          );
        })}
        {nodes.map((node) => {
          const radius = 14 + Math.sqrt(node.value / maxNodeValue) * 26;
          return (
            <g key={node.id}>
              <title>{`${node.id}：出现 ${node.value} 次`}</title>
              <circle cx={node.x} cy={node.y} r={radius + 5} fill={groupColors[node.group]} opacity={0.2} />
              <circle cx={node.x} cy={node.y} r={radius} fill={groupColors[node.group]} />
              <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={radius > 30 ? 12 : 10} fontWeight={600}>{node.id}</text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 px-4 text-center text-xs text-foreground/80">
        产品与运营、后端与算法、大模型与算法等连接更突出，说明样本中的技能要求常以组合形式出现。
      </p>
    </div>
  );
}
