"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const cityOptions = [
  "不限",
  "上海",
  "北京",
  "深圳",
  "广州",
  "杭州",
  "成都",
  "苏州",
  "南京",
  "武汉",
  "其他",
];

const educationOptions = ["不限", "大专", "本科", "硕士", "博士"];

const skillOptions = [
  "Python",
  "Java",
  "C++",
  "SQL",
  "数据分析",
  "机器学习",
  "算法",
  "深度学习",
  "大模型",
  "后端",
  "前端",
  "测试",
  "UI",
  "产品",
  "运营",
  "数据工程",
  "计算机视觉",
  "人工智能",
];

const directionOptions = [
  "不限",
  "技术开发",
  "算法AI",
  "数据分析",
  "产品运营",
  "设计测试",
];

const salaryOptions = ["不限", "3k以下", "3-6k", "6-10k", "10k以上"];

type FormState = {
  city: string;
  education: string;
  direction: string;
  salary: string;
  skills: string[];
};

type DirectionProfile = {
  title: string;
  type: "backend" | "algorithm" | "data" | "product" | "design";
  keywords: string[];
  suggestedSkills: string[];
  summary: string;
};

const profiles: DirectionProfile[] = [
  {
    title: "后端开发 / Java开发",
    type: "backend",
    keywords: ["Java", "后端", "SQL", "C++"],
    suggestedSkills: ["Spring Boot", "数据库设计", "接口开发", "项目部署"],
    summary: "适合已经具备编程基础、希望进入技术开发方向的同学。",
  },
  {
    title: "算法工程师 / 人工智能 / 大模型算法",
    type: "algorithm",
    keywords: ["Python", "算法", "机器学习", "深度学习", "大模型", "人工智能", "计算机视觉"],
    suggestedSkills: ["机器学习基础", "深度学习框架", "大模型应用", "算法项目"],
    summary: "适合数学和编程基础较好、希望继续深耕 AI 技术方向的同学。",
  },
  {
    title: "数据分析 / 数据工程",
    type: "data",
    keywords: ["数据分析", "SQL", "Python", "数据工程"],
    suggestedSkills: ["SQL 查询", "Python 分析", "可视化表达", "业务指标理解"],
    summary: "适合喜欢用数据解释问题，并且希望兼顾技术和业务理解的同学。",
  },
  {
    title: "产品经理 / 产品运营",
    type: "product",
    keywords: ["产品", "运营", "数据分析"],
    suggestedSkills: ["需求分析", "用户研究", "数据复盘", "产品文档"],
    summary: "适合对业务、用户和产品设计更感兴趣，同时希望理解 AI 应用场景的同学。",
  },
  {
    title: "前端开发 / UI设计 / 测试开发",
    type: "design",
    keywords: ["前端", "UI", "测试", "产品"],
    suggestedSkills: ["交互设计", "前端基础", "测试用例", "页面实现"],
    summary: "适合关注产品体验、页面实现或质量保障方向的同学。",
  },
];

const fallbackCities = ["上海", "北京", "深圳", "广州", "杭州"];

function scoreProfile(profile: DirectionProfile, form: FormState) {
  let score = 1;

  for (const skill of form.skills) {
    if (profile.keywords.includes(skill)) score += 4;
  }

  if (form.direction === "技术开发" && profile.type === "backend") score += 5;
  if (form.direction === "算法AI" && profile.type === "algorithm") score += 5;
  if (form.direction === "数据分析" && profile.type === "data") score += 5;
  if (form.direction === "产品运营" && profile.type === "product") score += 5;
  if (form.direction === "设计测试" && profile.type === "design") score += 5;

  if (form.salary === "6-10k" || form.salary === "10k以上") {
    if (["backend", "algorithm", "data"].includes(profile.type)) score += 3;
  }
  if (form.salary === "3-6k") {
    if (["product", "data", "backend"].includes(profile.type)) score += 2;
  }
  if (form.salary === "3k以下") {
    if (["product", "design"].includes(profile.type)) score += 2;
  }

  if (form.education === "不限" || form.education === "大专") {
    if (["product", "design"].includes(profile.type)) score += 2;
  }
  if (form.education === "本科") {
    if (["backend", "data", "product"].includes(profile.type)) score += 2;
  }
  if (form.education === "硕士" || form.education === "博士") {
    if (["algorithm", "data"].includes(profile.type)) score += 3;
  }

  return score;
}

function getReasons(form: FormState, topTitle: string) {
  const reasons: string[] = [];

  if (form.city === "不限") {
    reasons.push("你没有限定城市，因此优先推荐实习机会更多的一线和新一线城市。");
  } else {
    reasons.push(`你选择了${form.city}，推荐结果会优先考虑该城市及相近高机会城市。`);
  }

  if (form.skills.length > 0) {
    reasons.push(`你已选择 ${form.skills.slice(0, 4).join("、")} 等技能，和 ${topTitle} 的常见要求匹配度较高。`);
  } else {
    reasons.push("你暂未选择技能，因此推荐结果更多参考学历、方向和薪资偏好。");
  }

  if (form.salary !== "不限") {
    reasons.push(`结合你期望的 ${form.salary} 实习薪资，系统更倾向推荐薪资匹配度较高的岗位方向。`);
  }

  return reasons;
}

export function RecommendationAssistant() {
  const [form, setForm] = useState<FormState>({
    city: "不限",
    education: "本科",
    direction: "不限",
    salary: "不限",
    skills: [],
  });
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    return profiles
      .map((profile) => ({
        ...profile,
        score: scoreProfile(profile, form),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [form]);

  const recommendedCities = useMemo(() => {
    if (form.city === "不限") return fallbackCities.slice(0, 3);
    const city = form.city === "其他" ? "上海" : form.city;
    return [city, ...fallbackCities.filter((item) => item !== city)].slice(0, 3);
  }, [form.city]);

  const suggestedSkills = useMemo(() => {
    const skills = results.flatMap((item) => item.suggestedSkills);
    return Array.from(new Set(skills)).slice(0, 6);
  }, [results]);

  const toggleSkill = (skill: string) => {
    setForm((old) => ({
      ...old,
      skills: old.skills.includes(skill)
        ? old.skills.filter((item) => item !== skill)
        : [...old.skills, skill],
    }));
  };

  const reset = () => {
    setForm({
      city: "不限",
      education: "本科",
      direction: "不限",
      salary: "不限",
      skills: [],
    });
    setSubmitted(false);
  };

  const reasons = getReasons(form, results[0]?.title ?? "推荐方向");

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              填写你的偏好
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              选择越具体，推荐理由会越贴近你的实习方向。
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">目标城市</span>
            <select
              value={form.city}
              onChange={(event) =>
                setForm((old) => ({ ...old, city: event.target.value }))
              }
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-purple-400"
            >
              {cityOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">学历背景</span>
            <select
              value={form.education}
              onChange={(event) =>
                setForm((old) => ({ ...old, education: event.target.value }))
              }
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-purple-400"
            >
              {educationOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">感兴趣方向</span>
            <select
              value={form.direction}
              onChange={(event) =>
                setForm((old) => ({ ...old, direction: event.target.value }))
              }
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-purple-400"
            >
              {directionOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">期望薪资</span>
            <select
              value={form.salary}
              onChange={(event) =>
                setForm((old) => ({ ...old, salary: event.target.value }))
              }
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-purple-400"
            >
              {salaryOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <div>
            <p className="mb-3 text-sm font-medium text-foreground">
              已掌握技能
            </p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => {
                const active = form.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                      active
                        ? "border-purple-400 bg-purple-100 text-purple-800"
                        : "border-border bg-background text-muted-foreground hover:border-purple-300 hover:text-foreground"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setSubmitted(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
            >
              生成推荐
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              重置选择
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              推荐结果
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              本结果基于清洗后数据特征和本地规则匹配生成。
            </p>
          </div>
        </div>

        {!submitted ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 p-8 text-center">
            <Sparkles className="mb-4 h-10 w-10 text-purple-500" />
            <h3 className="text-lg font-semibold text-foreground">
              选择偏好后生成推荐
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              你可以先选择城市、学历、技能和期望方向，系统会给出更适合关注的实习岗位方向、城市和补充技能建议。
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="mb-3 font-semibold text-foreground">
                推荐岗位方向 Top 3
              </h3>
              <div className="grid gap-3">
                {results.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border bg-secondary/25 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-purple-600">
                          Top {index + 1}
                        </p>
                        <h4 className="mt-1 font-semibold text-foreground">
                          {item.title}
                        </h4>
                      </div>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        匹配分 {item.score}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-purple-50/70 p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold text-purple-800">
                  <MapPin className="h-4 w-4" />
                  推荐城市 Top 3
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendedCities.map((city) => (
                    <span
                      key={city}
                      className="rounded-full bg-white px-3 py-1 text-sm text-purple-800 shadow-sm"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-blue-50/70 p-4">
                <h3 className="mb-3 font-semibold text-blue-800">
                  建议补充技能
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white px-3 py-1 text-sm text-blue-800 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4">
              <h3 className="mb-3 font-semibold text-foreground">推荐理由</h3>
              <div className="space-y-2">
                {reasons.map((reason) => (
                  <p
                    key={reason}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                    {reason}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["查看城市实习分析", "/city"],
                ["查看岗位类型分析", "/job"],
                ["查看技能画像分析", "/skill"],
                ["查看综合洞察", "/conclusion"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-purple-300 hover:bg-purple-50"
                >
                  {label}
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
