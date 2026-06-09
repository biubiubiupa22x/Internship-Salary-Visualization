import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CompetitivenessScatterChart, EducationPieChart, EducationSalaryChart, ExperienceBarChart } from "@/components/dashboard/education-charts";
import { getEducationAnalysisData } from "@/lib/education-data";

const insights = [
  "本科是 AI 相关实习岗位要求中的主体，但硕士及以上学历对应更高实习薪资。",
  "清洗后的经验要求字段均为“不限”，因此流向图简化为学历与实习薪资档位关系。",
  "竞争力评分较高的岗位更容易对应中高薪区间，说明学历、技能和岗位门槛会共同影响实习薪资。",
];

export default function EducationPage() {
  const educationData = getEducationAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="实习岗位学历门槛分析" question="AI相关实习岗位对学历和经验有什么要求？这些要求如何影响实习薪资？" description="分析学历占比、学历薪资关系、经验分布和竞争力评分与实习薪资关系。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="实习岗位学历要求占比玫瑰图" subtitle="比较不同学历要求在样本中的占比差异" insight="本科要求占比最高，是 AI 相关实习岗位最常见的学历门槛；不限和大专岗位仍有一定数量，说明实习市场既有基础岗位，也存在更高门槛岗位。"><EducationPieChart data={educationData} /></ChartCard>
          <ChartCard title="学历要求与平均实习薪资" subtitle="观察学历门槛变化对应的薪资差异" insight="学历要求越高，平均实习薪资整体越高，硕士及以上岗位薪资优势更明显；本科作为主体门槛，既覆盖大量岗位，也构成进入 AI 相关实习市场的主要要求。"><EducationSalaryChart data={educationData} /></ChartCard>
          <ChartCard title="学历与实习薪资档位流向分析" subtitle="由于经验字段区分度较低，重点比较学历门槛和薪资档位关系" insight="流向结果显示，本科岗位更多流向 3-6k 和 6-10k 档位；较高学历要求更容易连接到中高薪区间，说明学历门槛与实习薪资之间存在一定关联。"><ExperienceBarChart data={educationData} /></ChartCard>
          <ChartCard title="实习岗位竞争力评分与薪资关系" subtitle="观察岗位门槛、技能要求与实习薪资之间的关系" insight="竞争力评分较高的岗位更容易出现在中高薪区域，高薪岗位通常伴随更多技能标签和更高学历要求，说明岗位综合门槛与薪资回报存在一定正向关系。"><CompetitivenessScatterChart data={educationData} /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
