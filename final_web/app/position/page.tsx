import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { LLMPositionsChart, PositionSalaryChart, PositionSkillRadar, PositionTypePie } from "@/components/dashboard/position-charts";

const insights = [
  "算法、机器学习和数据科学岗位构成 AI 岗位主流。",
  "AI 产品经理和数据科学家平均薪资较高，体现复合能力价值。",
  "不同岗位的技能侧重点不同，雷达图适合看结构差异而不是逐项读数。",
];

export default function PositionPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="职位类型分析" question="AI 领域有哪些主流岗位？各岗位的技能要求和薪资如何？" description="分析岗位类型分布、平均薪资、技能画像和大模型相关新兴岗位。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="岗位类型分布" subtitle="环形图展示各岗位类型占比" insight="算法工程师占比最高，是当前 AI 岗位需求的核心类型。"><PositionTypePie /></ChartCard>
          <ChartCard title="岗位类型平均薪资" subtitle="横向柱状图对比各岗位平均薪资" insight="AI 产品经理薪资领先，说明产品理解与 AI 能力结合具有较高市场价值。"><PositionSalaryChart /></ChartCard>
          <ChartCard title="岗位技能雷达图" subtitle="雷达图对比不同岗位技能侧重" insight="各岗位 Python 要求普遍较高，CV 与 NLP 在领域知识维度上差异明显。"><PositionSkillRadar /></ChartCard>
          <ChartCard title="大模型新兴岗位增长" subtitle="展示大模型相关岗位数量及增长率" insight="Prompt 工程师增长最突出，是大模型浪潮下的新兴方向。"><LLMPositionsChart /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
