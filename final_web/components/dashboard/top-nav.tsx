"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "首页", href: "/" },
  { label: "城市实习", href: "/city" },
  { label: "实习薪资", href: "/salary" },
  { label: "学历门槛", href: "/education" },
  { label: "行业公司", href: "/company" },
  { label: "实习岗位", href: "/job" },
  { label: "技能画像", href: "/skill" },
  { label: "综合洞察", href: "/conclusion" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              智岗洞察
            </span>
          </Link>

          <nav className="hidden items-center lg:flex">
            <div className="flex items-center rounded-full bg-secondary/50 p-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <nav className="hidden items-center gap-0.5 md:flex lg:hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-purple-100 font-medium text-purple-700"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground sm:inline-flex"
          >
            文档
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
          >
            开始分析
          </Button>
        </div>
      </div>
    </header>
  );
}
