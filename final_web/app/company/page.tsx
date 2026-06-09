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
          <ChartCard title="行业实习岗位需求结构" subtitle="比较 AI 相关实习岗位的行业集中程度" insight="互联网/游戏/软件行业实习岗位数量最多，汽车/机械/制造、电子/通信/硬件和金融相关行业也进入前列，说明计算机类实习机会主要集中在数字技术和信息产业相关领域。"><IndustryPieChart data={companyData} /></ChartCard>
          <ChartCard title="不同公司规模的实习岗位占比" subtitle="比较不同规模企业提供的实习岗位数量" insight="按原始 company_size 字段统计，2000 人以上大型企业提供的实习岗位数量最多，其次是 500-2000 人企业，说明大型企业是 AI 相关实习岗位供给主体。"><CompanySizeChart data={companyData} /></ChartCard>
          <ChartCard title="行业与公司规模实习岗位分布热力图" subtitle="观察行业和企业规模之间的岗位供给差异" insight="互联网/游戏/软件行业在 2000 人以上企业中岗位最集中，汽车制造、电子通信等行业也更多由中大型企业提供实习机会，说明行业差异和企业规模结构存在明显联动。"><IndustrySizeHeatmapChart data={companyData} /></ChartCard>
          <ChartCard title="行业实习岗位数量与平均实习薪资关系" subtitle="综合比较行业岗位规模和薪资表现" insight="互联网/游戏/软件岗位数量遥遥领先，电子/通信/硬件平均实习薪资更高，汽车制造也有一定规模，说明技术密集型行业对 AI 相关实习生需求更明显。"><IndustrySalaryChart data={companyData} /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
