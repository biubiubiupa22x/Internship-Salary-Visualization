import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CityJobStackedChart, JobBubbleChart, JobDemandChart, JobSalaryChart } from "@/components/dashboard/job-charts";
import { getJobAnalysisData } from "@/lib/job-data";

const insights = [
  "需求量最高的实习岗位类型不一定实习薪资最高，需要同时比较实习岗位数量与实习薪资水平。",
  "高薪实习岗位通常伴随更高学历门槛和更强综合能力要求。",
  "不同城市的实习岗位结构存在差异，一线城市实习岗位类型更丰富。",
];

export default function JobPage() {
  const jobData = getJobAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="实习岗位类型分析" question="哪些 AI 相关实习岗位类型最热门？哪些实习岗位薪资更高？" description="从需求量、实习薪资、学历门槛和城市结构观察 AI 相关实习岗位市场。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="实习岗位类型需求量排名" subtitle="横向柱状图展示需求量最高的实习岗位类型" insight="产品、数据、算法等实习岗位类型需求量较高，是当前样本中的主要实习方向。"><JobDemandChart data={jobData.demand} /></ChartCard>
          <ChartCard title="实习岗位类型平均实习薪资排名" subtitle="棒棒糖图展示平均实习薪资最高的岗位类型" insight="机器学习、算法和大模型相关实习岗位平均实习薪资较高，体现技术门槛带来的实习薪资差异。"><JobSalaryChart data={jobData.salary} /></ChartCard>
        </div>
        <div className="mt-6"><ChartCard title="实习岗位需求量-薪资-学历门槛气泡图" subtitle="横轴为实习岗位数量，纵轴为平均实习薪资，气泡大小表示学历门槛，参考线标出均值" insight="右上角代表高需求且高薪实习岗位类型；气泡越大表示学历门槛越高，可同时观察需求、薪资与门槛。"><JobBubbleChart data={jobData.bubble} /></ChartCard></div>
        <div className="mt-6"><ChartCard title="城市实习岗位类型结构 100% 堆叠图" subtitle="100% 堆叠柱状图展示不同城市的实习岗位类型结构占比" insight="结构占比图弱化城市总量差异，更适合比较不同城市内部的实习岗位类型构成。"><CityJobStackedChart data={jobData.cityStructure} stackTypes={jobData.stackTypes} /></ChartCard></div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
