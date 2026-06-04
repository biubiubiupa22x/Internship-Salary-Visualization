"use client";

import {
  ArrowRight,
  Briefcase,
  Building2,
  Code2,
  DollarSign,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MapPin,
    title: "城市需求分布",
    description: "探索各城市 AI 岗位分布情况，了解区域人才需求特征。",
    href: "/city",
  },
  {
    icon: DollarSign,
    title: "薪资水平分析",
    description: "分析不同岗位、城市和学历门槛下的薪资结构。",
    href: "/salary",
  },
  {
    icon: GraduationCap,
    title: "学历经验要求",
    description: "了解市场对学历和实习经验的真实需求。",
    href: "/education",
  },
  {
    icon: Building2,
    title: "公司行业分布",
    description: "查看招聘企业的行业分布与公司规模特征。",
    href: "/company",
  },
  {
    icon: Briefcase,
    title: "岗位类型解析",
    description: "拆解 AI 相关岗位类型及其需求占比。",
    href: "/position",
  },
  {
    icon: Code2,
    title: "技能画像",
    description: "分析热门技能关键词与技术栈要求。",
    href: "/skill",
  },
];

export function FeaturesGrid() {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            探索更多维度
          </h2>
          <p className="mt-3 text-muted-foreground">
            从多个角度深入了解 AI 人才市场
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-secondary/30"
            >
              <div className="mb-4 inline-flex self-start rounded-lg bg-secondary p-2.5">
                <feature.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                查看详情
                <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-secondary"
          >
            查看综合洞察报告
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
