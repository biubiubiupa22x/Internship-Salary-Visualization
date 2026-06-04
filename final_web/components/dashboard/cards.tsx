"use client";

import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtext?: string;
}

export function StatCard({ icon, label, value, subtext }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtext && (
            <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>
          )}
        </div>
        <div className="rounded-lg bg-accent/10 p-2.5 text-accent [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </div>
      </div>
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: string;
}

export function ChartCard({ title, description, children, footer }: ChartCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-border px-6 py-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">图表解读：</span>
            {footer}
          </p>
        </div>
      )}
    </div>
  );
}
