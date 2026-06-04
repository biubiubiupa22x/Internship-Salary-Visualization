"use client";

interface PageHeaderProps {
  title: string;
  question?: string;
  description?: string;
  subtitle?: string;
  badge?: string;
}

export function PageHeader({
  title,
  question,
  description,
  subtitle,
  badge,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-purple-400/20 blur-[80px]" />
        <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-blue-400/15 blur-[60px]" />
      </div>

      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
          <span className="text-xs font-medium text-purple-700">
            {badge ?? "数据分析"}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>

        {(question || subtitle) && (
          <p className="mt-4 text-lg font-medium text-purple-600">
            {question ?? subtitle}
          </p>
        )}

        {description && (
          <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
