"use client";

import { Lightbulb } from "lucide-react";

interface PageInsightsProps {
  title?: string;
  insights: string[];
}

export function PageInsights({ title = "本页发现", insights }: PageInsightsProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50/50 p-6">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute right-4 top-4 opacity-10">
        <Lightbulb className="h-24 w-24 text-purple-600" />
      </div>
      
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-purple-100 p-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900">{title}</h3>
        </div>
        
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
              <p className="text-sm leading-relaxed text-purple-800">{insight}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
