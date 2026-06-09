import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  FileText,
  Layers3,
  Network,
  Rocket,
  Sparkles,
} from "lucide-react";
import { TopNav } from "@/components/dashboard/top-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "项目说明｜智岗洞察",
  description: "智岗洞察项目的数据来源、处理流程、平台架构与主要结论说明。",
};

const sampleItems = [
  ["数据来源", "实习僧平台"],
  ["原始数据", "约 4.2 万条招聘记录"],
  ["清洗后样本", "8149 条"],
  ["覆盖城市", "21 个"],
  ["行业类别", "26 类"],
  ["岗位类型", "20 类"],
  ["技能关键词", "21 个"],
  ["研究对象", "计算机类 / AI 相关实习岗位"],
];

const processSteps = [
  [
    "采集任务构建",
    "基于城市列表和岗位关键词，形成“城市 × 岗位方向”的采集组合，覆盖计算机类与 AI 相关实习岗位。",
  ],
  [
    "反爬处理与数据采集",
    "通过 Session 会话保持、Cookie 注入、User-Agent 轮换和随机请求延迟，稳定抓取岗位名称、城市、薪资、学历、公司规模、行业类型和岗位链接等字段。",
  ],
  [
    "动态字体解码",
    "针对薪资数字加密问题，结合字体解析、图像渲染和 OCR 识别还原薪资字段，并对 Java、AI 等易误识别文本进行纠偏。",
  ],
  [
    "数据清洗与去重",
    "以岗位详情页链接作为唯一标识删除重复记录，并处理城市、薪资、学历等关键字段缺失和异常文本。",
  ],
  [
    "薪资统一与分箱",
    "将日薪、月薪和区间薪资统一换算为 k/月，构造最低薪资、最高薪资和平均薪资，并划分为 3k 以下、3-6k、6-10k、10-15k 等薪资档位。",
  ],
  [
    "字段标准化与门槛编码",
    "统一城市、学历、公司规模和行业字段，并将“不限、大专、本科、硕士、博士”等学历要求编码为可分析的学历分数。",
  ],
  [
    "岗位与技能特征构建",
    "根据搜索词、岗位标题和领域规则完成岗位类型归类，并基于技能词典提取 Python、Java、算法、数据分析、大模型、前后端等关键词，统计技能频率、技能数量和技能共现关系。",
  ],
  [
    "聚合数据导出",
    "按照城市、薪资档位、学历、行业、公司规模、岗位类型和技能关键词等维度进行聚合，生成前端展示所需的 JSON 数据表。",
  ],
];

const modules = [
  ["城市实习", "分析岗位城市分布和城市集聚特征"],
  ["实习薪资", "分析薪资整体分布、薪资档位和城市薪资差异"],
  ["学历门槛", "分析学历要求占比和学历与薪资关系"],
  ["行业公司", "分析行业结构和公司规模分布"],
  ["实习岗位", "分析岗位类型需求量、平均薪资和学历门槛"],
  ["技能画像", "分析技能关键词频率和技能共现关系"],
  ["综合洞察", "分析城市、薪资、岗位、学历和技能综合关系"],
];

const architecture = [
  "Python 数据清洗",
  "SQLite 数据库存储",
  "JSON 数据导出",
  "Next.js 可视化页面",
  "Vercel 在线部署",
];

const conclusions = [
  "AI 相关实习岗位具有明显城市集聚特征。",
  "实习薪资主要集中在 3k-6k 区间。",
  "岗位类型呈现多元化，产品、运营、开发、算法和数据方向均有较多需求。",
  "技能需求体现复合化趋势，岗位往往同时关注业务理解、开发能力和数据能力。",
  "学历、技能和岗位门槛与实习薪资之间存在一定关联。",
];

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-purple-400/20 blur-[90px]" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-400/15 blur-[80px]" />
          </div>
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-3 py-1 text-sm text-purple-700">
              <FileText className="h-4 w-4" />
              课程项目说明
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              项目说明
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              本页面整理“智岗洞察”的数据来源、处理流程、可视化模块和平台架构，方便快速了解这个 AI 相关实习岗位数据可视化项目是如何完成的。
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <SectionCard icon={<Sparkles className="h-5 w-5" />} title="项目概述">
            <p className="leading-relaxed text-muted-foreground">
              本项目基于实习僧平台发布的计算机类 / AI 相关实习岗位招聘数据，从城市分布、实习薪资、学历门槛、行业公司、岗位类型和技能关键词等维度进行可视化分析，帮助学生更直观地了解 AI 相关实习市场和能力需求。
            </p>
          </SectionCard>

          <SectionCard icon={<Database className="h-5 w-5" />} title="数据来源与样本说明">
            <div className="grid gap-3 sm:grid-cols-2">
              {sampleItems.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-secondary/30 px-4 py-3"
                >
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="mt-6 grid gap-6">
          <SectionCard icon={<Layers3 className="h-5 w-5" />} title="数据处理流程">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map(([title, text], index) => (
                <div
                  key={title}
                  className="relative rounded-xl border border-border bg-secondary/25 p-4"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={<BarChart3 className="h-5 w-5" />} title="可视化分析模块">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-purple-300 hover:bg-purple-50/40"
                >
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={<Network className="h-5 w-5" />} title="平台架构">
            <div className="grid gap-3 md:grid-cols-5">
              {architecture.map((item, index) => (
                <div key={item} className="flex items-center gap-3 md:block">
                  <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-4 text-center font-medium text-purple-800">
                    {item}
                  </div>
                  {index < architecture.length - 1 && (
                    <ArrowRight className="hidden h-5 w-5 text-purple-400 md:mx-auto md:mt-3 md:block" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              数据清洗、特征构建和数据库整理主要在 Python 与 SQLite 中完成；前端读取整理后的 JSON 数据文件，并在 Next.js 页面中完成聚合、排序和图表渲染。
            </p>
          </SectionCard>

          <SectionCard icon={<CheckCircle2 className="h-5 w-5" />} title="主要结论">
            <div className="grid gap-3 md:grid-cols-2">
              {conclusions.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-purple-50/70 px-4 py-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                  <p className="text-sm leading-relaxed text-purple-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
          >
            <Link href="/assistant">
              进入推荐助手
              <Rocket className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
