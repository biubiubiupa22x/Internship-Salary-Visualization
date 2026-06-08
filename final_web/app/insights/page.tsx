import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  KeyMetricsGrid,
  ConclusionCards,
  RecommendationCards,
} from "@/components/dashboard/insights-cards";

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader
          title="实习招聘综合洞察"
          question="从 AI 相关实习岗位数据中可以观察到哪些核心结论？"
          description="汇总各维度的分析结果，提炼实习招聘市场中的关键发现。"
        />
        
        {/* Key Metrics */}
        <section className="mt-8">
          <h2 className="mb-6 text-xl font-semibold text-foreground">核心指标概览</h2>
          <KeyMetricsGrid />
        </section>
        
        {/* Conclusions */}
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-foreground">主要结论</h2>
          <ConclusionCards />
        </section>
        
        {/* Recommendations */}
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-foreground">行动建议</h2>
          <RecommendationCards />
        </section>
        
        {/* Data Source */}
        <section className="mt-12 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">数据说明</h2>
          <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <div>
              <p className="mb-2"><strong className="text-foreground">数据来源：</strong>主流招聘平台公开实习岗位数据</p>
              <p className="mb-2"><strong className="text-foreground">数据时间：</strong>2024年1月 - 2024年12月</p>
              <p><strong className="text-foreground">样本量：</strong>清洗后的 AI 相关实习岗位样本</p>
            </div>
            <div>
              <p className="mb-2"><strong className="text-foreground">分析维度：</strong>城市、薪资、学历、经验、行业、岗位、技能</p>
              <p className="mb-2"><strong className="text-foreground">技术栈：</strong>TypeScript + React + Next.js + Recharts</p>
              <p><strong className="text-foreground">更新频率：</strong>季度更新</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
