import { TopNav } from "@/components/dashboard/top-nav";
import { PageHeader } from "@/components/dashboard/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageInsights } from "@/components/dashboard/page-insights";
import { SkillFrequencyChart, SkillHeatmap, SkillNetworkGraph, SkillWordCloud } from "@/components/dashboard/skill-charts";
import { getSkillAnalysisData } from "@/lib/skill-data";

const insights = [
  "产品、运营、后端、算法和 Java 等关键词在当前样本中出现频次较高。",
  "AI相关实习岗位更偏好复合型技能组合，单一技能较难覆盖完整实习岗位需求。",
  "技能共现关系体现了 AI 相关实习岗位对算法、编程、数据处理和工程工具的组合能力要求。",
];

export default function SkillPage() {
  const skillData = getSkillAnalysisData();

  return (
    <div className="relative min-h-screen bg-background">
      <TopNav />
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <PageHeader title="实习岗位技能画像分析" question="企业在 AI相关实习岗位中最看重哪些技能？技能之间是否存在组合关系？" description="通过技能关键词频次、词云、共现热力图和网络图观察 AI 相关实习岗位的技能生态。" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="实习岗位技能关键词频率 Top 12" subtitle="横向柱状图展示高频技能关键词排名" insight="产品、运营、后端等关键词出现频次较高，反映当前 AI 相关实习岗位关键词分布。"><SkillFrequencyChart data={skillData.rank} /></ChartCard>
          <ChartCard title="实习岗位技能关键词词云" subtitle="字号表示技能在实习岗位中的出现热度" insight="词云使用数据库技能频次生成，字号越大表示在实习岗位中出现次数越高。"><SkillWordCloud data={skillData.words} /></ChartCard>
        </div>
        <div className="mt-6"><ChartCard title="实习岗位技能共现热力图" subtitle="展示实习岗位技能之间共同出现的强度" insight="热力图基于数据库共现关系计算，颜色越深表示两个关键词越常在同一实习岗位中出现。"><SkillHeatmap skills={skillData.heatmapSkills} matrix={skillData.heatmapMatrix} /></ChartCard></div>
        <div className="mt-6"><ChartCard title="实习岗位技能共现网络图" subtitle="展示实习岗位技能组合生态与核心技能连接关系" insight="网络图展示高频技能之间的共现连接，节点越大表示该技能在实习岗位中出现频次越高。"><SkillNetworkGraph nodes={skillData.networkNodes} links={skillData.networkLinks} /></ChartCard></div>
        <div className="mt-6"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
