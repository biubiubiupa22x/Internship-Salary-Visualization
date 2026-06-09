import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CityBoxPlotChart, PositionBoxPlotChart, SalaryHistogramChart, SalaryTiersPieChart } from "@/components/dashboard/salary-charts";
import { getSalaryAnalysisData } from "@/lib/salary-data";

const insights = [
  "实习薪资主要集中在中间档位，高薪实习岗位占比相对较小。",
  "上海、北京等核心城市样本更多，实习薪资分布也更稳定；部分城市虽然岗位少，但可能出现较高薪资点。",
  "算法、大模型、Java、后端等技术类方向薪资更靠前，产品和运营类岗位需求更大但薪资中枢相对平稳。",
];

export default function SalaryPage() {
  const salaryData = getSalaryAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="实习薪资水平分析" question="AI相关实习岗位薪资主要分布在哪些区间？城市和实习岗位类型会带来怎样的差异？" description="从实习薪资直方图与密度曲线、档位占比、城市箱线图和岗位类型箱线图观察实习薪资结构。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="实习薪资整体分布直方图 + 密度曲线" subtitle="观察样本实习薪资的主要集中区间" insight="实习薪资主要集中在 3-6k 区间，3k 以下岗位也占有较大比例，6-10k 属于次高集中区；10k 以上样本明显减少，高薪实习岗位相对稀缺。"><SalaryHistogramChart data={salaryData} /></ChartCard>
          <ChartCard title="实习薪资档位环形图" subtitle="对比不同实习薪资档位的样本占比" insight="3-6k 是占比最高的实习薪资档位，其次是 3k 以下和 6-10k，说明 AI 相关实习岗位整体薪资以中低档位为主，中高薪岗位主要集中在少数城市和技术方向。"><SalaryTiersPieChart data={salaryData} /></ChartCard>
          <ChartCard title="Top10 城市实习薪资分布箱线图" subtitle="比较岗位数量前 10 城市的实习薪资中位数与离散程度" insight="上海、北京、深圳、广州、杭州等头部城市岗位样本较多，薪资中位数和高薪点更具有代表性；部分城市薪资波动较大，说明城市之间的实习薪资结构并不完全一致。"><CityBoxPlotChart data={salaryData} /></ChartCard>
          <ChartCard title="Top10 实习岗位类型薪资分布箱线图" subtitle="比较需求量前 10 岗位类型的薪资差异" insight="算法、大模型、Java、后端等技术类岗位薪资中枢更高，产品和数据类岗位虽然数量更多，但薪资水平相对平稳，体现出岗位技能门槛带来的薪资差异。"><PositionBoxPlotChart data={salaryData} /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
