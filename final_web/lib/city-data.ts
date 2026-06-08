import { readJsonData, toNumber } from "@/lib/json-data"

export interface CityAnalysisDatum {
  city: string
  jobs: number
  salary: number
}

type FactJob = {
  city_id?: number | null
  salary_mid?: number | null
  salary_valid?: number | null
}

type City = {
  city_id: number
  city_name: string
}

function round2(value: number): number {
  return Number(value.toFixed(2))
}

export function getCityAnalysisData(): CityAnalysisDatum[] {
  const factJobs = readJsonData<FactJob>("fact_job.json")
  const cities = readJsonData<City>("dim_city.json")
  const cityNameMap = new Map(cities.map((city) => [city.city_id, city.city_name]))

  const cityGroup = new Map<number, { jobs: number; salaries: number[] }>()

  for (const job of factJobs) {
    if (!job.city_id) continue

    const current = cityGroup.get(job.city_id) ?? { jobs: 0, salaries: [] }
    current.jobs += 1

    if (toNumber(job.salary_valid) === 1 && job.salary_mid !== null && job.salary_mid !== undefined) {
      current.salaries.push(toNumber(job.salary_mid))
    }

    cityGroup.set(job.city_id, current)
  }

  return Array.from(cityGroup.entries())
    .map(([cityId, item]) => ({
      city: cityNameMap.get(cityId) ?? "未知",
      jobs: item.jobs,
      salary: item.salaries.length
        ? round2(item.salaries.reduce((sum, value) => sum + value, 0) / item.salaries.length)
        : 0,
    }))
    .filter((item) => item.city !== "未知")
    .sort((a, b) => b.jobs - a.jobs)
}
