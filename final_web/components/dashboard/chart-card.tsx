"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  insight?: string;
  className?: string;
}

export function ChartCard({ title, subtitle, children, insight, className = "" }: ChartCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-purple-300/50 ${className}`}>
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-400/10 blur-2xl" />
      </div>
      
      <div className="relative">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        
        <div className="min-h-[280px]">
          {children}
        </div>
        
        {insight && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-purple-50/80 px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
            <p className="text-sm text-purple-700">
              <span className="font-semibold">图表解读：</span>
              {insight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
