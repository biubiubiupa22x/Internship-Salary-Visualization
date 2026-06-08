"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ totalJobs }: { totalJobs: number }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-purple-400/25 blur-[100px]" />
        <div className="absolute right-1/4 top-20 h-[400px] w-[500px] translate-x-1/2 rounded-full bg-blue-400/20 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[400px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
            <span className="text-sm text-purple-700">
              基于 {totalJobs.toLocaleString()} 条清洗后招聘数据
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-foreground">智岗洞察：</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              AI相关实习岗位数据可视化分析
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            基于真实招聘数据，从城市需求、实习薪资、学历门槛、岗位类型与技能画像等维度，观察人工智能相关实习岗位市场特征。
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
            >
              开始探索
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-300 text-foreground hover:bg-purple-50"
            >
              查看方法说明
            </Button>
          </div>

          <div className="mt-16 flex flex-col items-center justify-center gap-4 text-muted-foreground sm:flex-row sm:gap-8">
            <p className="text-sm uppercase tracking-wider">数据来源</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <span className="text-sm font-medium">实习僧</span>
              <span className="text-sm font-medium">清洗数据集</span>
              <span className="text-sm font-medium">SQLite 数据库</span>
              <span className="text-sm font-medium">可视化聚合视图</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
