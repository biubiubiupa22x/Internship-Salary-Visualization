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
          <ChartCard title="实习岗位技能关键词频率 Top 12" subtitle="对比高频技能关键词和岗位方向热度" insight="从技能词频结果看，产品、运营、后端、算法、Java 和数据分析出现次数较高，说明当前 AI 相关实习岗位并不只集中在算法研发，也大量涉及产品运营、后端开发和数据分析等方向。"><SkillFrequencyChart data={skillData.rank} /></ChartCard>
          <ChartCard title="实习岗位技能关键词词云" subtitle="突出样本中最核心的技能标签" insight="词云中产品、运营、后端、算法、Java、数据分析等关键词最突出，说明这些能力或岗位方向是样本中最核心的技能标签。"><SkillWordCloud data={skillData.words} /></ChartCard>
        </div>
        <div className="mt-6"><ChartCard title="实习岗位技能共现热力图" subtitle="展示实习岗位技能之间共同出现的强度" insight="共现结果显示，产品与运营、后端与算法、大模型与算法、Java 与后端等组合联系更明显，说明企业在描述 AI 相关实习岗位时，往往强调多种能力的组合。"><SkillHeatmap skills={skillData.heatmapSkills} matrix={skillData.heatmapMatrix} /></ChartCard></div>
        <div className="mt-6"><ChartCard title="实习岗位技能共现网络图" subtitle="展示实习岗位技能组合生态与核心技能连接关系" insight="网络图中，产品、运营、后端和算法位于较核心位置，并与多个关键词形成连接，说明这些方向在技能体系中关联性较强，是 AI 相关实习岗位中常见的能力组合。"><SkillNetworkGraph nodes={skillData.networkNodes} links={skillData.networkLinks} /></ChartCard></div>
        <div className="mt-6"><PageInsights insights={insights} /></div>
      </main>
    </div>
  );
}
