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
          <ChartCard title="实习岗位类型需求量排名" subtitle="对比不同实习岗位类型的市场需求热度" insight="产品、数据、算法、后端和 Java 位居需求量前列，其中产品类实习岗位数量最高，说明 AI 相关实习市场中产品方向供给最多，技术开发类岗位也占据重要位置。"><JobDemandChart data={jobData.demand} /></ChartCard>
          <ChartCard title="实习岗位类型平均实习薪资排名" subtitle="比较不同实习岗位类型的薪资回报差异" insight="算法、大模型、Java 和后端等技术类岗位平均实习薪资较高，说明技术门槛更强的方向通常有更高薪资回报；产品、运营类岗位需求较大，但薪资优势不如技术岗明显。"><JobSalaryChart data={jobData.salary} /></ChartCard>
        </div>
        <div className="mt-6"><ChartCard title="实习岗位需求量-薪资-学历门槛气泡图" subtitle="综合比较岗位需求规模、薪资水平和学历门槛" insight="产品类岗位需求量最大，但薪资并非最高；算法、后端、Java 和大模型等技术类方向薪资更突出，说明实习岗位需求规模和薪资水平并不完全一致。"><JobBubbleChart data={jobData.bubble} /></ChartCard></div>
        <div className="mt-6"><ChartCard title="城市与岗位类型结构热力图" subtitle="比较主要城市内部的实习岗位类型占比" insight="上海、北京等头部城市产品经理和后端开发占比较高，深圳、广州、成都等城市产品运营占比较突出，说明不同城市的 AI 相关实习岗位结构存在明显差异。"><CityJobStackedChart data={jobData.cityStructure} stackTypes={jobData.stackTypes} /></ChartCard></div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
