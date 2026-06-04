import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CompanySizeChart, IndustryPieChart, IndustrySalaryChart, TopCompaniesChart } from "@/components/dashboard/company-charts";

const insights = [
  "互联网/游戏/软件行业贡献超过半数岗位，是当前样本中的绝对主力。",
  "按原始 company_size 字段统计，2000 人以上公司贡献了最多岗位。",
  "行业薪资与岗位数量并不完全同步，电子/通信/硬件薪资较高但岗位量低于互联网行业。",
];

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="公司行业分析" question="哪些行业和公司在招聘 AI 人才？不同行业薪资差异如何？" description="分析行业分布、公司规模、头部企业和行业薪资竞争力。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="行业岗位需求结构" subtitle="Treemap 矩形树图用面积展示各行业岗位数量" insight="互联网/游戏/软件行业面积最大，说明岗位需求高度集中在软件互联网相关行业。"><IndustryPieChart /></ChartCard>
          <ChartCard title="公司规模岗位占比" subtitle="胶囊式横向进度条展示不同公司规模下的岗位数量占比" insight="按原始 company_size 字段统计，2000 人以上公司占比最高，大型企业是岗位供给的重要来源。"><CompanySizeChart /></ChartCard>
          <ChartCard title="招聘量 Top 15 公司帕累托图" subtitle="柱状表示公司岗位数量，折线表示累计占比" insight="头部公司贡献了大部分样例招聘机会，累计占比超过 80% 的关键点已标出。"><TopCompaniesChart /></ChartCard>
          <ChartCard title="行业岗位数量 × 平均薪资气泡图" subtitle="横轴为岗位数量，纵轴为平均薪资，气泡大小表示行业岗位占比" insight="互联网行业岗位数量遥遥领先；电子/通信/硬件平均薪资更高，体现出数量与薪资并非完全同步。"><IndustrySalaryChart /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
