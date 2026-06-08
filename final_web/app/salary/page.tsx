import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CityBoxPlotChart, PositionBoxPlotChart, SalaryHistogramChart, SalaryTiersPieChart } from "@/components/dashboard/salary-charts";
import { getSalaryAnalysisData } from "@/lib/salary-data";

const insights = [
  "实习薪资主要集中在中间档位，高薪实习岗位占比相对较小。",
  "城市和实习岗位类型都会影响实习薪资分布，箱线图能展示波动范围。",
  "复杂分布图不强制显示全部数值，悬停查看具体四分位信息更清晰。",
];

export default function SalaryPage() {
  const salaryData = getSalaryAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="实习薪资水平分析" question="AI相关实习岗位薪资主要分布在哪些区间？城市和实习岗位类型会带来怎样的差异？" description="从实习薪资直方图与密度曲线、档位占比、城市箱线图和岗位类型箱线图观察实习薪资结构。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="实习薪资整体分布直方图 + 密度曲线" subtitle="柱状图展示实习岗位数量，折线展示平滑后的分布密度" insight="实习薪资档位由真实 salary_mid 聚合得到，可观察 AI 相关实习岗位主要集中在哪些薪资区间。"><SalaryHistogramChart data={salaryData} /></ChartCard>
          <ChartCard title="实习薪资档位环形图" subtitle="环形图展示各实习薪资档位占比" insight="实习薪资档位占比来自真实 salary_tier_id 聚合，可观察 AI 相关实习岗位主要集中在哪些薪资区间。"><SalaryTiersPieChart data={salaryData} /></ChartCard>
          <ChartCard title="主要城市实习薪资分布箱线图" subtitle="箱线图展示不同城市实习薪资范围与中位数" insight="城市箱线图按真实实习岗位薪资聚合，可对比头部城市的实习薪资中位数和波动范围。"><CityBoxPlotChart data={salaryData} /></ChartCard>
          <ChartCard title="实习岗位类型薪资分布箱线图" subtitle="箱线图展示不同实习岗位类型的薪资范围与中位数" insight="岗位类型箱线图按真实实习岗位薪资聚合，可观察不同实习岗位方向的薪资差异。"><PositionBoxPlotChart data={salaryData} /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
