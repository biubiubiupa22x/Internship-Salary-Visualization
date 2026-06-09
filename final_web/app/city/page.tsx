import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { CityMapPlaceholder, CityRankChart, CitySalaryCompareChart, ParetoChart } from "@/components/dashboard/city-charts";
import { getCityAnalysisData } from "@/lib/city-data";

const insights = [
  "AI相关实习岗位呈现明显城市集中特征，头部城市贡献了多数实习机会。",
  "城市实习岗位数量与平均实习薪资并非完全同步，深圳等城市实习薪资竞争力更突出。",
  "少数头部城市贡献了绝大部分实习岗位机会，实习地域选择会显著影响机会密度。",
];

export default function CityPage() {
  const cityData = getCityAnalysisData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="城市实习需求分析" question="AI相关实习岗位主要集中在哪些城市？实习岗位数量与实习薪资水平是否一致？" description="从实习岗位数量、平均实习薪资、地理分布和集中度四个角度观察城市实习机会差异。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="城市实习岗位数量排名 Top 10" subtitle="比较主要城市的 AI 相关实习岗位供给规模" insight="上海、北京、深圳和广州位居前列，其中上海和北京岗位数量明显领先，说明 AI 相关实习机会高度集中在一线城市。"><CityRankChart data={cityData} /></ChartCard>
          <ChartCard title="城市实习岗位数量与平均实习薪资对比" subtitle="对比城市岗位规模和薪资表现是否同步" insight="上海、北京岗位数量领先，但平均实习薪资并不总是与岗位数量完全同步；部分岗位量较小的城市也可能出现较高薪资水平。"><CitySalaryCompareChart data={cityData} /></ChartCard>
          <ChartCard title="城市实习岗位地理分布气泡图" subtitle="观察 AI 相关实习机会的空间分布格局" insight="AI相关实习岗位主要集中在东部沿海和核心一线/新一线城市，上海、北京、深圳、广州和杭州形成较明显的高密度区域。"><CityMapPlaceholder data={cityData} /></ChartCard>
          <ChartCard title="城市实习岗位集中度帕累托图" subtitle="分析头部城市对实习机会的贡献程度" insight="上海和北京贡献了最大比例的 AI 相关实习岗位，前几名城市累计占比迅速上升，说明实习机会具有明显头部集中效应。"><ParetoChart data={cityData} /></ChartCard>
        </div>
        <div className="mt-8"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
