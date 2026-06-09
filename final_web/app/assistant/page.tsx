import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { TopNav } from "@/components/dashboard/top-nav";
import { RecommendationAssistant } from "@/components/dashboard/recommendation-assistant";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "岗位推荐小助手｜智岗洞察",
  description: "根据城市、学历、技能和薪资偏好推荐更适合关注的 AI 相关实习岗位方向。",
};

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-purple-400/20 blur-[90px]" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-400/15 blur-[80px]" />
          </div>
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-3 py-1 text-sm text-purple-700">
              本地规则匹配
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              岗位推荐小助手
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              根据你的城市偏好、学历背景和技能标签，匹配更适合关注的实习岗位方向。
            </p>
          </div>
        </div>

        <RecommendationAssistant />

        <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50/70 p-5 text-sm leading-relaxed text-purple-800">
          本推荐基于清洗后的岗位数据和规则匹配结果，仅作为实习方向参考。实际求职还需要结合个人项目经历、课程基础和岗位具体要求综合判断。
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Home className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
          >
            <Link href="/conclusion">
              查看综合洞察
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
