import { readJsonData, toNumber } from "@/lib/json-data"

export interface SalaryHistogramDatum {
  range: string
  count: number
}

export interface SalaryTierDatum {
  name: string
  value: number
  percentage: number
}

export interface SalaryBoxDatum {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  city?: string
  position?: string
}

export interface SalaryAnalysisData {
  histogram: SalaryHistogramDatum[]
  tiers: SalaryTierDatum[]
  cityBoxes: SalaryBoxDatum[]
  positionBoxes: SalaryBoxDatum[]
}

type FactJob = {
  city_id?: number | null
  position_type_id?: number | null
  salary_mid?: number | null
  salary_valid?: number | null
  salary_tier_id?: number | null
}

type City = {
  city_id: number
  city_name: string
}

type PositionType = {
  position_type_id: number
  type_name: string
}

type SalaryTier = {
  salary_tier_id: number
  tier_name: string
}

const HISTOGRAM_BINS = [
  { range: "3k以下", min: Number.NEGATIVE_INFINITY, max: 3 },
  { range: "3-6k", min: 3, max: 6 },
  { range: "6-10k", min: 6, max: 10 },
  { range: "10-15k", min: 10, max: 15 },
  { range: "15-20k", min: 15, max: 20 },
  { range: "20k以上", min: 20, max: Number.POSITIVE_INFINITY },
]

function round1(value: number): number {
  return Number(value.toFixed(1))
}

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return 0
  const index = (sorted.length - 1) * q
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower
  return sorted[upper] === undefined
    ? sorted[lower]
    : sorted[lower] * (1 - weight) + sorted[upper] * weight
}

function makeBox(values: number[]): Pick<SalaryBoxDatum, "min" | "q1" | "median" | "q3" | "max"> {
  const sorted = values.slice().sort((a, b) => a - b)
  return {
    min: round1(sorted[0] ?? 0),
    q1: round1(quantile(sorted, 0.25)),
    median: round1(quantile(sorted, 0.5)),
    q3: round1(quantile(sorted, 0.75)),
    max: round1(sorted[sorted.length - 1] ?? 0),
  }
}

function salaryTierOrder(name: string): number {
  if (name.includes("3k以下")) return 1
  if (name.includes("3-6")) return 2
  if (name.includes("6-10")) return 3
  if (name.includes("10-15")) return 4
  if (name.includes("15-20")) return 5
  if (name.includes("20k以上")) return 6
  return 99
}

export function getSalaryAnalysisData(): SalaryAnalysisData {
  const factJobs = readJsonData<FactJob>("fact_job.json")
  const cities = readJsonData<City>("dim_city.json")
  const positionTypes = readJsonData<PositionType>("dim_position_type.json")
  const salaryTiers = readJsonData<SalaryTier>("dim_salary_tier.json")

  const cityMap = new Map(cities.map((city) => [city.city_id, city.city_name]))
  const positionTypeMap = new Map(positionTypes.map((type) => [type.position_type_id, type.type_name]))
  const salaryTierMap = new Map(salaryTiers.map((tier) => [tier.salary_tier_id, tier.tier_name]))

  const validJobs = factJobs.filter(
    (job) => toNumber(job.salary_valid) === 1 && job.salary_mid !== null && job.salary_mid !== undefined
  )

  const histogram = HISTOGRAM_BINS.map((bin) => ({
    range: bin.range,
    count: validJobs.filter((job) => {
      const salary = toNumber(job.salary_mid)
      return salary >= bin.min && salary < bin.max
    }).length,
  }))

  const tierGroup = new Map<number, number>()
  for (const job of factJobs) {
    if (!job.salary_tier_id) continue
    tierGroup.set(job.salary_tier_id, (tierGroup.get(job.salary_tier_id) ?? 0) + 1)
  }

  const tiers = Array.from(tierGroup.entries())
    .map(([tierId, value]) => ({
      name: salaryTierMap.get(tierId) ?? "未知档位",
      value,
      percentage: factJobs.length ? round1((value / factJobs.length) * 100) : 0,
    }))
    .filter((item) => item.name !== "未知档位")
    .sort((a, b) => salaryTierOrder(a.name) - salaryTierOrder(b.name))

  const citySalaryMap = new Map<number, number[]>()
  const positionSalaryMap = new Map<number, number[]>()
  for (const job of validJobs) {
    const salary = toNumber(job.salary_mid)
    if (job.city_id) citySalaryMap.set(job.city_id, [...(citySalaryMap.get(job.city_id) ?? []), salary])
    if (job.position_type_id) {
      positionSalaryMap.set(job.position_type_id, [...(positionSalaryMap.get(job.position_type_id) ?? []), salary])
    }
  }

  const cityBoxes = Array.from(citySalaryMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6)
    .map(([cityId, values]) => ({
      city: cityMap.get(cityId) ?? "未知",
      ...makeBox(values),
    }))

  const positionBoxes = Array.from(positionSalaryMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6)
    .map(([typeId, values]) => ({
      position: positionTypeMap.get(typeId) ?? "未知",
      ...makeBox(values),
    }))

  return { histogram, tiers, cityBoxes, positionBoxes }
}
