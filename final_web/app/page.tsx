import { Briefcase, Code2, DollarSign, MapPin } from "lucide-react";
import { TopNav } from "@/components/dashboard/top-nav";
import { HeroSection } from "@/components/dashboard/hero-section";
import { StatCard } from "@/components/dashboard/cards";
import { InsightsSection } from "@/components/dashboard/insights-section";
import { FeaturesGrid } from "@/components/dashboard/features-grid";
import { getHomeDashboardData } from "@/lib/dashboard-data";

const formatNumber = (value: number) => value.toLocaleString("zh-CN");

export default function Page() {
  const data = getHomeDashboardData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <HeroSection totalJobs={data.summary.totalJobs} />

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Briefcase />}
              label="实习岗位总数"
              value={formatNumber(data.summary.totalJobs)}
              subtext="清洗后的 AI 相关实习岗位样本"
            />
            <StatCard
              icon={<MapPin />}
              label="覆盖城市"
              value={formatNumber(data.summary.totalCities)}
              subtext="覆盖主要招聘城市"
            />
            <StatCard
              icon={<DollarSign />}
              label="平均实习薪资"
              value={`${data.summary.avgSalary}k`}
              subtext="按有效实习薪资样本计算"
            />
            <StatCard
              icon={<Code2 />}
              label="技能关键词"
              value={formatNumber(data.summary.totalSkills)}
              subtext="由实习岗位标题和关键词规则抽取"
            />
          </div>
        </div>
      </section>

      <InsightsSection {...data.insights} />
      <FeaturesGrid />

      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            AI相关实习岗位招聘市场可视化分析平台 · 数据仅供课程项目与学术研究使用
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Built with Next.js, TypeScript, Tailwind CSS, and SQLite
          </p>
        </div>
      </footer>
    </div>
  );
}
