"use client";

import { TrendingUp, MapPin, DollarSign, GraduationCap, Building2, Briefcase, Code2, Lightbulb } from "lucide-react";

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: string;
}

function InsightCard({ icon, title, value, description, color }: InsightCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-purple-300/50">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-400/10 blur-2xl" />
      </div>
      
      <div className="relative">
        <div className={`mb-4 inline-flex rounded-lg p-2.5 ${color}`}>
          {icon}
        </div>
        <h3 className="mb-1 text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="mb-2 text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

const keyMetrics = [
  {
    icon: <Briefcase className="h-5 w-5 text-purple-600" />,
    title: "实习岗位总数",
    value: "1,236",
    description: "覆盖主流招聘平台的 AI 相关实习岗位",
    color: "bg-purple-100",
  },
  {
    icon: <MapPin className="h-5 w-5 text-blue-600" />,
    title: "覆盖城市",
    value: "32",
    description: "北上深杭领跑，占比超 60%",
    color: "bg-blue-100",
  },
  {
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
    title: "平均实习薪资",
    value: "16.8k",
    description: "15-25k 区间占比最高",
    color: "bg-green-100",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-orange-600" />,
    title: "本硕占比",
    value: "88%",
    description: "学历门槛普遍较高",
    color: "bg-orange-100",
  },
  {
    icon: <Building2 className="h-5 w-5 text-pink-600" />,
    title: "互联网+AI",
    value: "60%+",
    description: "行业分布高度集中",
    color: "bg-pink-100",
  },
  {
    icon: <Code2 className="h-5 w-5 text-cyan-600" />,
    title: "核心技能",
    value: "Python",
    description: "出现频次 856 次，遥遥领先",
    color: "bg-cyan-100",
  },
];

const conclusions = [
  {
    title: "区域集聚效应显著",
    points: [
      "AI 相关实习岗位高度集中在一线城市和新一线城市",
      "北京、上海、深圳三城贡献超 60% 的实习岗位需求",
      "成都、杭州作为新一线代表，正在快速崛起",
    ],
  },
  {
    title: "实习薪资结构相对清晰",
    points: [
      "实习薪资主要集中在中间档位，样本定价相对集中",
      "学历门槛是影响实习薪资的重要因素",
      "部分技术密集行业的实习薪资竞争力更强",
    ],
  },
  {
    title: "实习岗位门槛相对较高",
    points: [
      "本科+硕士学历要求占比近 90%",
      "3-5 年经验是企业最青睐的候选人画像",
      "复合型能力（技术+业务）更具实习岗位竞争力",
    ],
  },
  {
    title: "技术栈演进明显",
    points: [
      "Python 是 AI 领域的绝对核心语言",
      "深度学习框架以 TensorFlow 和 PyTorch 为主",
      "大模型/LLM 技能需求快速增长，成为新热点",
    ],
  },
];

const recommendations = [
  {
    target: "求职者",
    suggestions: [
      "优先掌握 Python 和主流深度学习框架",
      "关注大模型相关技术，提前布局新赛道",
      "一线城市机会更多，但竞争也更激烈",
      "持续学习是 AI 领域的必备素质",
    ],
  },
  {
    target: "企业",
    suggestions: [
      "实习薪资竞争力是吸引优秀实习生的重要因素",
      "可关注新一线城市的实习岗位供给与成本差异",
      "重视实习生培养，形成 AI 相关初级能力储备",
      "关注大模型相关实习岗位，提前布局技术方向",
    ],
  },
];

export function KeyMetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {keyMetrics.map((metric) => (
        <InsightCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}

export function ConclusionCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {conclusions.map((conclusion) => (
        <div
          key={conclusion.title}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            {conclusion.title}
          </h3>
          <ul className="space-y-2">
            {conclusion.points.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-sm text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function RecommendationCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {recommendations.map((rec) => (
        <div
          key={rec.target}
          className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50/50 p-6"
        >
          <div className="pointer-events-none absolute right-4 top-4 opacity-10">
            <Lightbulb className="h-20 w-20 text-purple-600" />
          </div>
          
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                给{rec.target}的建议
              </span>
            </div>
            
            <ul className="space-y-3">
              {rec.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-700">
                    {index + 1}
                  </span>
                  <span className="text-sm text-purple-800">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
