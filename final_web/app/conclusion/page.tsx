import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { PageInsights } from "@/components/dashboard/page-insights";
import {
  CityJobHeatmap,
  CityRadarChart,
  CitySalaryHeatmap,
  CompetitivenessScatterChart,
  CorrelationHeatmap,
  FinalConclusionCard,
} from "@/components/dashboard/conclusion-charts";
import { getConclusionData } from "@/lib/conclusion-data";

export default function ConclusionPage() {
  const data = getConclusionData();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="综合洞察"
          question="综合城市、薪资、岗位、学历和技能因素，AI 招聘市场呈现哪些结构性特征？"
          badge="数据驱动决策"
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <CitySalaryHeatmap rows={data.citySalaryRows} columns={data.salaryLevels} />
          <CityJobHeatmap rows={data.cityJobRows} columns={data.jobTypes} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CompetitivenessScatterChart data={data.competitiveness} />
          <CorrelationHeatmap variables={data.correlationVars} matrix={data.correlationData} />
        </div>
        <div className="mt-6">
          <CityRadarChart data={data.radarData} cities={data.radarCities} />
        </div>
        <div className="mt-8">
          <PageInsights insights={data.insights} />
        </div>
        <div className="relative mt-8">
          <FinalConclusionCard conclusion={data.finalConclusion} />
        </div>
      </main>
    </div>
  );
}
