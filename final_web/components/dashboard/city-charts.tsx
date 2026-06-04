"use client";

import {
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const cityData = [
  { city: "上海", jobs: 2584, salary: 4.6 },
  { city: "北京", jobs: 2214, salary: 4.59 },
  { city: "深圳", jobs: 622, salary: 4.56 },
  { city: "广州", jobs: 566, salary: 3.38 },
  { city: "杭州", jobs: 418, salary: 4.23 },
  { city: "成都", jobs: 387, salary: 3.41 },
  { city: "苏州", jobs: 229, salary: 4.29 },
  { city: "南京", jobs: 215, salary: 3.88 },
  { city: "武汉", jobs: 200, salary: 3.74 },
  { city: "合肥", jobs: 119, salary: 3.22 },
  { city: "无锡", jobs: 110, salary: 4.62 },
  { city: "重庆", jobs: 77, salary: 3.21 },
  { city: "厦门", jobs: 72, salary: 3.88 },
  { city: "长沙", jobs: 67, salary: 3.48 },
  { city: "西安", jobs: 62, salary: 3.54 },
  { city: "天津", jobs: 55, salary: 3.3 },
  { city: "郑州", jobs: 48, salary: 3.37 },
  { city: "全国", jobs: 46, salary: 3.79 },
  { city: "青岛", jobs: 23, salary: 3.28 },
  { city: "佛山", jobs: 22, salary: 2.95 },
  { city: "宁波", jobs: 13, salary: 4.1 },
];

const cityRankData = cityData.slice(0, 10);
const citySalaryData = cityData.slice(0, 10);
const cityJobsTotal = cityData.reduce((sum, item) => sum + item.jobs, 0);
let cumulativeJobs = 0;
const paretoData = cityData.map((item) => {
  cumulativeJobs += item.jobs;
  return {
    city: item.city,
    jobs: item.jobs,
    cumulative: Number(((cumulativeJobs / cityJobsTotal) * 100).toFixed(1)),
  };
});

const interpolateColor = (start: string, end: string, ratio: number) => {
  const parse = (hex: string) => [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
  const [sr, sg, sb] = parse(start);
  const [er, eg, eb] = parse(end);
  const mix = (from: number, to: number) =>
    Math.round(from + (to - from) * ratio)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(sr, er)}${mix(sg, eg)}${mix(sb, eb)}`;
};

export function CityRankChart() {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cityRankData} layout="vertical" margin={{ left: 0, right: 44 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="city" width={50} tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value} 个岗位`, "岗位数量"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          <Bar dataKey="jobs" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="jobs" position="right" className="fill-foreground" fontSize={12} />
            {cityRankData.map((_, index) => (
              <Cell key={index} fill={index < 3 ? "var(--chart-1)" : "var(--chart-3)"} fillOpacity={Math.max(0.4, 1 - index * 0.06)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CitySalaryCompareChart() {
  const maxSalary = citySalaryData.reduce(
    (max, item) => (item.salary > max.salary ? item : max),
    citySalaryData[0]
  );

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={citySalaryData} margin={{ left: -10, right: 10 }}>
          <XAxis dataKey="city" tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" domain={[2.5, 5]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="jobs" name="岗位数量" radius={[4, 4, 0, 0]}>
            {citySalaryData.map((_, index) => (
              <Cell
                key={`city-salary-bar-${index}`}
                fill={interpolateColor("#8b5cf6", "#f472b6", index / Math.max(citySalaryData.length - 1, 1))}
              />
            ))}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="salary" name="平均薪资(k)" stroke="#ec4899" strokeWidth={2.5} dot={{ fill: "#f472b6", r: 4 }} />
          <ReferenceDot yAxisId="right" x={maxSalary.city} y={maxSalary.salary} r={6} fill="#db2777" stroke="white" label={{ value: `最高 ${maxSalary.salary}k`, position: "top", fill: "var(--foreground)", fontSize: 12 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CityMapPlaceholder() {
  const cities = [
    { name: "北京", x: 70, y: 25, size: 50 },
    { name: "上海", x: 80, y: 50, size: 45 },
    { name: "深圳", x: 75, y: 80, size: 40 },
    { name: "杭州", x: 82, y: 55, size: 30 },
    { name: "广州", x: 70, y: 78, size: 25 },
    { name: "成都", x: 40, y: 55, size: 20 },
    { name: "武汉", x: 60, y: 52, size: 18 },
    { name: "西安", x: 45, y: 38, size: 15 },
  ];
  const minSize = Math.min(...cities.map((city) => city.size));
  const maxSize = Math.max(...cities.map((city) => city.size));

  return (
    <div className="relative h-[280px] overflow-hidden rounded-lg bg-gradient-to-br from-sky-50 to-blue-100/70">
      <svg viewBox="0 0 100 100" className="h-full w-full opacity-20">
        <path d="M20,20 Q30,15 50,18 Q70,20 85,30 Q90,45 88,60 Q85,75 75,85 Q60,90 45,88 Q30,85 20,75 Q15,60 18,45 Q20,30 20,20" fill="none" stroke="#93c5fd" strokeWidth="0.5" />
      </svg>

      {cities.map((city) => (
        <div
          key={city.name}
          className="absolute flex items-center justify-center"
          style={{ left: `${city.x}%`, top: `${city.y}%`, transform: "translate(-50%, -50%)" }}
          title={`${city.name}：气泡越大代表岗位越多`}
        >
          <div
            className="rounded-full opacity-80 shadow-sm transition-transform hover:scale-110"
            style={{
              width: `${city.size}px`,
              height: `${city.size}px`,
              backgroundColor: interpolateColor(
                "#dbeafe",
                "#60a5fa",
                (city.size - minSize) / Math.max(maxSize - minSize, 1)
              ),
            }}
          />
          <span className="absolute -bottom-5 whitespace-nowrap text-xs font-medium text-foreground">
            {city.name}
          </span>
        </div>
      ))}

      <div className="absolute bottom-3 left-3 rounded-md bg-white/80 px-2 py-1 text-xs text-muted-foreground">
        气泡大小代表岗位数量
      </div>
    </div>
  );
}

export function ParetoChart() {
  const keyPoint = paretoData.find((item) => item.cumulative >= 80) ?? paretoData[0];

  return (
    <div className="h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={paretoData} margin={{ left: -10, right: 10, bottom: 42 }}>
          <XAxis dataKey="city" interval={0} angle={-35} textAnchor="end" height={58} tick={{ fontSize: 10, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="jobs" name="岗位数量" radius={[4, 4, 0, 0]}>
            {paretoData.map((_, index) => (
              <Cell
                key={`pareto-bar-${index}`}
                fill={interpolateColor(
                  "#2f9e68",
                  "#c7ead3",
                  index / Math.max(paretoData.length - 1, 1)
                )}
              />
            ))}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="cumulative" name="累计占比(%)" stroke="#2f9e68" strokeWidth={2.5} dot={{ fill: "#a8d5ba", r: 4 }} />
          <ReferenceDot yAxisId="right" x={keyPoint.city} y={keyPoint.cumulative} r={6} fill="#2f9e68" stroke="white" label={{ value: "超过80%", position: "top", fill: "var(--foreground)", fontSize: 12 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
