import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CompanySizeChart, IndustryPieChart, IndustrySalaryChart, IndustrySizeHeatmapChart } from "@/components/dashboard/company-charts";
import { getCompanyAnalysisData } from "@/lib/company-data";

const insights = [
  "互联网/游戏/软件行业贡献超过半数 AI 相关实习岗位，是当前样本中的绝对主力。",
  "按原始 company_size 字段统计，2000 人以上公司贡献了最多实习岗位。",
  "行业实习薪资与实习岗位数量并不完全同步，电子/通信/硬件实习薪资较高但岗位量低于互联网行业。",
];

export default function CompanyPage() {
  const companyData = getCompanyAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="实习岗位行业与公司规模分析" question="哪些行业和公司规模更集中地提供 AI 相关实习岗位？不同行业实习薪资差异如何？" description="分析实习岗位行业分布、公司规模结构和行业实习薪资竞争力。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="行业实习岗位需求结构" subtitle="Treemap 矩形树图用面积展示各行业实习岗位数量" insight="互联网/游戏/软件行业面积最大，说明实习岗位需求高度集中在软件互联网相关行业。"><IndustryPieChart data={companyData} /></ChartCard>
          <ChartCard title="不同公司规模的实习岗位占比" subtitle="胶囊式横向进度条展示不同公司规模下的实习岗位数量占比" insight="按原始 company_size 字段统计，2000 人以上公司占比最高，大型企业是实习岗位供给的重要来源。"><CompanySizeChart data={companyData} /></ChartCard>
          <ChartCard title="行业与公司规模实习岗位分布热力图" subtitle="展示不同公司规模在各行业中的实习岗位分布差异。" insight="行业 × 公司规模热力图可以反映 AI 相关实习岗位在产业领域和企业规模之间的结构差异。红色表示该行业中对应规模企业实习岗位占比更高，黄色表示占比较低；悬停可查看真实实习岗位数量。"><IndustrySizeHeatmapChart data={companyData} /></ChartCard>
          <ChartCard title="行业实习岗位数量与平均实习薪资关系" subtitle="横轴为实习岗位数量，纵轴为平均实习薪资，气泡大小表示行业实习岗位占比" insight="互联网行业实习岗位数量遥遥领先；电子/通信/硬件平均实习薪资更高，体现出数量与薪资并非完全同步。"><IndustrySalaryChart data={companyData} /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
