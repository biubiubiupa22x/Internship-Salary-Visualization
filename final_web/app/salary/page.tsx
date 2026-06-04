import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CityBoxPlotChart, PositionBoxPlotChart, SalaryHistogramChart, SalaryTiersPieChart } from "@/components/dashboard/salary-charts";

const insights = [
  "薪资主要集中在中间档位，高薪岗位占比相对较小。",
  "城市和岗位类型都会影响薪资分布，箱线图能展示波动范围。",
  "复杂分布图不强制显示全部数值，悬停查看具体四分位信息更清晰。",
];

export default function SalaryPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="薪资水平分析" question="AI 岗位薪资主要分布在哪些区间？城市和岗位类型会带来怎样的差异？" description="从薪资直方图与密度曲线、档位占比、城市箱线图和岗位箱线图观察薪资结构。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="薪资整体分布直方图 + 密度曲线" subtitle="柱状图展示岗位数量，折线展示平滑后的分布密度" insight="15-18k 区间岗位数量最多，密度曲线显示薪资分布峰值集中在中高薪区间。"><SalaryHistogramChart /></ChartCard>
          <ChartCard title="薪资档位环形图 + 高薪占比指标卡" subtitle="环形图展示各薪资档位占比，指标卡突出 25k 以上岗位比例" insight="15-20k 和 20-25k 是主要薪资档，高薪岗位占比相对较小但仍有一定规模。"><SalaryTiersPieChart /></ChartCard>
          <ChartCard title="主要城市薪资分布箱线图" subtitle="箱线图展示不同城市薪资范围与中位数" insight="深圳薪资上界更高，北京和上海整体分布也较靠前。"><CityBoxPlotChart /></ChartCard>
          <ChartCard title="岗位类型薪资分布箱线图" subtitle="箱线图展示不同岗位薪资范围与中位数" insight="大模型工程师薪资范围和中位数更高，岗位溢价明显。"><PositionBoxPlotChart /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
