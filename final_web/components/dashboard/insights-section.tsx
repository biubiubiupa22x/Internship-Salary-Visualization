"use client";

import { Code2, Lightbulb, MapPin, TrendingUp } from "lucide-react";

interface InsightsSectionProps {
  topCity: string;
  topCityJobs: number;
  topCityShare: number;
  topCityGroupShare: number;
  topSalaryTier: string;
  topSalaryTierShare: number;
  topSkill: string;
  topSkillCount: number;
}

export function InsightsSection({
  topCity,
  topCityJobs,
  topCityShare,
  topCityGroupShare,
  topSalaryTier,
  topSalaryTierShare,
  topSkill,
  topSkillCount,
}: InsightsSectionProps) {
  const insights = [
    {
      icon: MapPin,
      title: "头部城市集中",
      description: `${topCity}以 ${topCityJobs.toLocaleString()} 个实习岗位位居第一，占全部样本的 ${topCityShare}%；前三城市合计占比 ${topCityGroupShare}%。`,
    },
    {
      icon: TrendingUp,
      title: "实习薪资档位集中",
      description: `${topSalaryTier} 是实习岗位最多的薪资档位，占全部实习岗位的 ${topSalaryTierShare}%。`,
    },
    {
      icon: Code2,
      title: "高频技能明确",
      description: `${topSkill} 出现 ${topSkillCount.toLocaleString()} 次，是当前实习岗位样本中最突出的技能/岗位关键词。`,
    },
    {
      icon: Lightbulb,
      title: "数据来自数据库",
      description:
        "首页统计卡、城市排名、实习薪资档位和技能频次均读取自 JSON 数据备份聚合结果。",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            核心洞察
          </h2>
          <p className="mt-3 text-muted-foreground">
            基于清洗后的真实招聘数据自动生成
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-2.5">
                <insight.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {insight.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {insight.description}
              </p>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
