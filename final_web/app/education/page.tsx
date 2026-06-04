import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CompetitivenessScatterChart, EducationPieChart, EducationSalaryChart, ExperienceBarChart } from "@/components/dashboard/education-charts";

const insights = [
  "本科是岗位要求中的主体，但硕士及以上学历对应更高薪资。",
  "清洗后的经验要求字段均为“不限”，因此流向图简化为学历与薪资档位关系。",
  "竞争力评分与薪资可用于观察岗位门槛和薪资水平之间的关系。",
];

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="学历经验要求" question="AI 岗位对学历和经验有什么要求？这些要求如何影响薪资？" description="分析学历占比、学历薪资关系、经验分布和竞争力评分与薪资关系。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="学历要求占比玫瑰图" subtitle="玫瑰图用半径大小展示不同学历要求占比" insight="本科要求占比最高，是 AI 岗位最常见的学历门槛。"><EducationPieChart /></ChartCard>
          <ChartCard title="学历要求与平均薪资" subtitle="柱状图展示平均薪资，趋势线展示学历层级带来的薪资变化" insight="学历要求越高，平均薪资整体越高，趋势线显示博士岗位薪资最高。"><EducationSalaryChart /></ChartCard>
          <ChartCard title="学历与薪资档位流向分析" subtitle="由于经验要求字段区分度较低，本图重点展示学历要求与薪资档位之间的流向关系。" insight="当前数据中经验要求字段区分度较低，因此本图简化为学历与薪资档位流向分析。从流向结果可以观察不同学历门槛更容易对应哪些薪资区间。"><ExperienceBarChart /></ChartCard>
          <ChartCard title="岗位竞争力评分与薪资关系" subtitle="观察岗位门槛、技能要求与薪资水平之间的关系。" insight="如果散点整体呈现右上分布，说明学历、经验和技能要求更高的岗位通常对应更高薪资。当前数据缺少技能数量字段，因此气泡大小保持一致。"><CompetitivenessScatterChart /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
