import { readJsonData, toNumber } from "@/lib/json-data"

export interface IndustryDemandDatum {
  name: string
  value: number
  percentage: number
}

export interface CompanySizeDatum {
  size: string
  count: number
  percentage: number
}

export interface IndustrySalaryDatum {
  industry: string
  jobs: number
  salary: number
  percentage: number
}

export interface IndustrySizeHeatmapCell {
  industry: string
  size: string
  count: number
}

export interface IndustrySizeHeatmapData {
  industries: string[]
  sizes: string[]
  cells: IndustrySizeHeatmapCell[]
  maxCount: number
}

export interface CompanyAnalysisData {
  industries: IndustryDemandDatum[]
  companySizes: CompanySizeDatum[]
  industrySizeHeatmap: IndustrySizeHeatmapData
  industrySalary: IndustrySalaryDatum[]
}

type FactJob = {
  company_size_id?: number | null
  industry_id?: number | null
  salary_mid?: number | null
  salary_valid?: number | null
}

type CompanySize = {
  company_size_id: number
  size_name: string
}

type Industry = {
  industry_id: number
  industry_name: string
}

function round1(value: number): number {
  return Number(value.toFixed(1))
}

function round2(value: number): number {
  return Number(value.toFixed(2))
}

function percentage(count: number, total: number): number {
  return total ? round1((count / total) * 100) : 0
}

const SIZE_ORDER = ["少于15人", "15-50人", "50-150人", "150-500人", "500-2000人", "2000人以上", "其他/未知"]

function normalizeCompanySize(sizeName: string | undefined): string {
  if (!sizeName || sizeName.includes("未知")) return "其他/未知"
  if (sizeName.includes("少于15") || sizeName.includes("15人以下")) return "少于15人"
  if (sizeName.includes("15-50")) return "15-50人"
  if (sizeName.includes("50-150") || sizeName.includes("50-100") || sizeName.includes("50-200")) return "50-150人"
  if (sizeName.includes("150-500") || sizeName.includes("100-499")) return "150-500人"
  if (sizeName.includes("500-2000") || sizeName.includes("500-1000")) return "500-2000人"
  if (sizeName.includes("2000人以上") || sizeName.includes("1000人以上")) return "2000人以上"
  return "其他/未知"
}

export function getCompanyAnalysisData(): CompanyAnalysisData {
  const factJobs = readJsonData<FactJob>("fact_job.json")
  const companySizes = readJsonData<CompanySize>("dim_company_size.json")
  const industries = readJsonData<Industry>("dim_industry.json")

  const totalJobs = factJobs.length
  const companySizeMap = new Map(companySizes.map((item) => [item.company_size_id, item.size_name]))
  const industryMap = new Map(industries.map((item) => [item.industry_id, item.industry_name]))

  const industryGroup = new Map<number, { count: number; salaries: number[] }>()
  const sizeGroup = new Map<number | string, number>()
  const industrySizeGroup = new Map<string, number>()

  for (const job of factJobs) {
    if (job.industry_id) {
      const current = industryGroup.get(job.industry_id) ?? { count: 0, salaries: [] }
      current.count += 1
      if (toNumber(job.salary_valid) === 1 && job.salary_mid !== null && job.salary_mid !== undefined) {
        current.salaries.push(toNumber(job.salary_mid))
      }
      industryGroup.set(job.industry_id, current)
    }

    const sizeKey = job.company_size_id ?? "unknown"
    sizeGroup.set(sizeKey, (sizeGroup.get(sizeKey) ?? 0) + 1)

    if (job.industry_id) {
      const industryName = industryMap.get(job.industry_id)
      const companySizeName = typeof sizeKey === "number" ? companySizeMap.get(sizeKey) : undefined
      if (industryName) {
        const normalizedSize = normalizeCompanySize(companySizeName)
        const heatmapKey = `${industryName}|||${normalizedSize}`
        industrySizeGroup.set(heatmapKey, (industrySizeGroup.get(heatmapKey) ?? 0) + 1)
      }
    }
  }

  const industryRows = Array.from(industryGroup.entries())
    .map(([industryId, item]) => ({
      name: industryMap.get(industryId) ?? "未知行业",
      value: item.count,
      percentage: percentage(item.count, totalJobs),
      salaries: item.salaries,
    }))
    .filter((item) => item.name !== "未知行业")
    .sort((a, b) => b.value - a.value)

  const topIndustryRows = industryRows.slice(0, 7)
  const otherIndustryCount = industryRows.slice(7).reduce((sum, item) => sum + item.value, 0)
  const industriesForTreemap = [
    ...topIndustryRows.map(({ salaries: _salaries, ...item }) => item),
    ...(otherIndustryCount
      ? [{ name: "其他行业", value: otherIndustryCount, percentage: percentage(otherIndustryCount, totalJobs) }]
      : []),
  ]

  const companySizesForChart = Array.from(sizeGroup.entries())
    .map(([sizeId, count]) => ({
      size: typeof sizeId === "number" ? companySizeMap.get(sizeId) ?? "未知规模" : "未知规模",
      count,
      percentage: percentage(count, totalJobs),
    }))
    .sort((a, b) => b.count - a.count)

  const heatmapIndustries = industryRows.slice(0, 8).map((item) => item.name)
  const heatmapCells = heatmapIndustries.flatMap((industry) =>
    SIZE_ORDER.map((size) => ({
      industry,
      size,
      count: industrySizeGroup.get(`${industry}|||${size}`) ?? 0,
    }))
  )
  const industrySizeHeatmap: IndustrySizeHeatmapData = {
    industries: heatmapIndustries,
    sizes: SIZE_ORDER,
    cells: heatmapCells,
    maxCount: Math.max(...heatmapCells.map((cell) => cell.count), 0),
  }

  const industrySalary = industryRows
    .map((item) => ({
      industry: item.name,
      jobs: item.value,
      salary: item.salaries.length
        ? round2(item.salaries.reduce((sum, value) => sum + value, 0) / item.salaries.length)
        : 0,
      percentage: item.percentage,
    }))
    .filter((item) => item.salary > 0)
    .slice(0, 12)

  return {
    industries: industriesForTreemap,
    companySizes: companySizesForChart,
    industrySizeHeatmap,
    industrySalary,
  }
}
