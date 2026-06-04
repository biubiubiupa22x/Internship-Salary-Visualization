import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CityJobStackedChart, JobBubbleChart, JobDemandChart, JobSalaryChart } from "@/components/dashboard/job-charts";
import { getJobAnalysisData } from "@/lib/job-data";

const insights = [
  "需求量最高的岗位不一定薪资最高，需要同时比较岗位数量与薪资水平。",
  "高薪岗位通常伴随更高学历门槛和更强综合能力要求。",
  "不同城市的岗位结构存在差异，一线城市岗位类型更丰富。",
];

export default function JobPage() {
  const jobData = getJobAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="岗位类型分析" question="哪些 AI 岗位最热门？哪些岗位薪资更高？" description="从需求量、薪资、学历门槛和城市结构观察 AI 岗位市场。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="岗位类型需求量排名" subtitle="横向柱状图展示需求量最高的岗位类型" insight="产品、数据、算法等岗位类型需求量较高，是当前样本中的主要岗位方向。"><JobDemandChart data={jobData.demand} /></ChartCard>
          <ChartCard title="岗位类型平均薪资排名" subtitle="棒棒糖图展示平均薪资最高的岗位类型" insight="机器学习、算法和大模型相关岗位平均薪资较高，体现技术门槛带来的薪资差异。"><JobSalaryChart data={jobData.salary} /></ChartCard>
        </div>
        <div className="mt-6"><ChartCard title="岗位需求量-薪资-学历门槛气泡图" subtitle="横轴为岗位数量，纵轴为平均薪资，气泡大小表示学历门槛，参考线标出均值" insight="右上角代表高需求且高薪岗位；气泡越大表示学历门槛越高，可同时观察需求、薪资与门槛。"><JobBubbleChart data={jobData.bubble} /></ChartCard></div>
        <div className="mt-6"><ChartCard title="城市岗位类型结构 100% 堆叠图" subtitle="100% 堆叠柱状图展示不同城市的岗位类型结构占比" insight="结构占比图弱化城市总量差异，更适合比较不同城市内部的岗位类型构成。"><CityJobStackedChart data={jobData.cityStructure} stackTypes={jobData.stackTypes} /></ChartCard></div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
