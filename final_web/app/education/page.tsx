import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CompetitivenessScatterChart, EducationPieChart, EducationSalaryChart, ExperienceBarChart } from "@/components/dashboard/education-charts";
import { getEducationAnalysisData } from "@/lib/education-data";

const insights = [
  "本科是 AI 相关实习岗位要求中的主体，但硕士及以上学历对应更高实习薪资。",
  "清洗后的经验要求字段均为“不限”，因此流向图简化为学历与实习薪资档位关系。",
  "竞争力评分与实习薪资可用于观察实习岗位门槛和实习薪资水平之间的关系。",
];

export default function EducationPage() {
  const educationData = getEducationAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="实习岗位学历门槛分析" question="AI相关实习岗位对学历和经验有什么要求？这些要求如何影响实习薪资？" description="分析学历占比、学历薪资关系、经验分布和竞争力评分与实习薪资关系。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="实习岗位学历要求占比玫瑰图" subtitle="玫瑰图用半径大小展示不同学历要求占比" insight="本科要求占比最高，是 AI 相关实习岗位最常见的学历门槛。"><EducationPieChart data={educationData} /></ChartCard>
          <ChartCard title="学历要求与平均实习薪资" subtitle="柱状图展示平均实习薪资，趋势线展示学历层级带来的薪资变化" insight="学历要求越高，平均实习薪资整体越高，趋势线展示不同学历门槛的实习薪资变化。"><EducationSalaryChart data={educationData} /></ChartCard>
          <ChartCard title="学历与实习薪资档位流向分析" subtitle="由于经验要求字段区分度较低，本图重点展示学历要求与实习薪资档位之间的流向关系。" insight="当前数据中经验要求字段区分度较低，因此本图简化为学历与实习薪资档位流向分析。从流向结果可以观察不同学历门槛更容易对应哪些实习薪资区间。"><ExperienceBarChart data={educationData} /></ChartCard>
          <ChartCard title="实习岗位竞争力评分与薪资关系" subtitle="观察实习岗位门槛、技能要求与实习薪资水平之间的关系。" insight="散点图使用真实实习岗位采样，颜色区分学历要求，气泡大小反映该实习岗位识别出的技能数量。"><CompetitivenessScatterChart data={educationData} /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
