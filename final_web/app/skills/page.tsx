import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { SkillCategoryChart, SkillCooccurrence, SkillsRankChart, SkillsWordCloud } from "@/components/dashboard/skills-charts";

const insights = [
  "Python 是 AI 领域的核心语言，出现频次远高于多数技能。",
  "机器学习、深度学习是基础算法能力要求，几乎是 AI 岗位标配。",
  "大模型/LLM 技能需求增长明显，反映行业技术方向变化。",
];

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="技能画像分析" question="企业需要什么样的 AI 技能？哪些技能最受欢迎？" description="通过技能关键词频次、词云、分类统计和共现关系描绘技能需求画像。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="技能关键词频次 Top 15" subtitle="横向柱状图展示最高频的技能关键词" insight="Python、机器学习、深度学习是 AI 岗位最常见的三类能力要求。" className="lg:row-span-2"><SkillsRankChart /></ChartCard>
          <ChartCard title="技能词云" subtitle="词云展示技能关键词相对热度" insight="字号越大表示出现频次越高，核心技能在视觉上更突出。"><SkillsWordCloud /></ChartCard>
          <ChartCard title="技能分类统计" subtitle="按类别汇总技能提及次数" insight="算法领域技能需求最旺盛，其次是框架工具和编程语言。"><SkillCategoryChart /></ChartCard>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChartCard title="技能共现热力图" subtitle="展示技能之间的关联强度" insight="Python 与机器学习、深度学习高频共现，是组合技能的基础。"><SkillCooccurrence /></ChartCard>
          <PageInsights insights={insights} />
        </div>
      </main>
    </div>
  );
}
