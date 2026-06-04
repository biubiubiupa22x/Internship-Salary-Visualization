import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CityMapPlaceholder, CityRankChart, CitySalaryCompareChart, ParetoChart } from "@/components/dashboard/city-charts";

const insights = [
  "AI 岗位呈现明显城市集中特征，头部城市贡献了多数岗位机会。",
  "城市岗位数量与平均薪资并非完全同步，深圳等城市薪资竞争力更突出。",
  "少数头部城市贡献了绝大部分岗位机会，求职地域选择会显著影响机会密度。",
];

export default function CityPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="城市需求分析" question="AI 岗位主要集中在哪些城市？岗位数量与薪资水平是否一致？" description="从岗位数量、平均薪资、地理分布和集中度四个角度观察城市市场差异。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="城市岗位数量排名 Top 10" subtitle="横向柱状图展示岗位需求最高的城市" insight="北京、上海、深圳位居前列，头部城市岗位数量优势明显。"><CityRankChart /></ChartCard>
          <ChartCard title="城市岗位数量与平均薪资对比" subtitle="柱线双轴图对比岗位数量与平均薪资" insight="岗位数量最高的城市不一定薪资最高，薪资线上的最高点已被突出标记。"><CitySalaryCompareChart /></ChartCard>
          <ChartCard title="城市地理分布气泡图" subtitle="气泡大小表示岗位数量强弱" insight="岗位机会主要集中在东部沿海和核心一线/新一线城市。"><CityMapPlaceholder /></ChartCard>
          <ChartCard title="城市岗位集中度帕累托图" subtitle="柱状图与累计占比折线观察集中程度" insight="少数城市贡献了大部分岗位，累计占比超过 80% 的关键点已标出。"><ParetoChart /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
