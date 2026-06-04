import { readJsonData, toNumber } from "@/lib/json-data"

export interface DashboardSummary {
  totalJobs: number
  totalCities: number
  avgSalary: number
  totalSkills: number
}

export interface CityJobDatum {
  city: string
  jobs: number
  salary: number
}

export interface SalaryTierDatum {
  range: string
  value: number
  percentage: number
}

export interface SkillDatum {
  skill: string
  count: number
}

export interface HomeDashboardData {
  summary: DashboardSummary
  cityJobs: CityJobDatum[]
  salaryTiers: SalaryTierDatum[]
  skills: SkillDatum[]
  insights: {
    topCity: string
    topCityJobs: number
    topCityShare: number
    topCityGroupShare: number
    topSalaryTier: string
    topSalaryTierShare: number
    topSkill: string
    topSkillCount: number
  }
}

type FactJob = {
  job_id: number
  city_id: number
  salary_mid?: number
  salary_valid?: number
  salary_tier_id?: number
}

type City = {
  city_id: number
  city_name: string
}

type SalaryTier = {
  salary_tier_id: number
  tier_name: string
}

type Skill = {
  skill_id: number
  skill_name: string
}

type JobSkill = {
  job_id: number
  skill_id: number
}

function round1(value: number): number {
  return Number(value.toFixed(1))
}

function avg(values: number[]): number {
  if (!values.length) return 0
  return round1(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function getHomeDashboardData(): HomeDashboardData {
  const factJobs = readJsonData<FactJob>("fact_job.json")
  const cities = readJsonData<City>("dim_city.json")
  const salaryTiersDim = readJsonData<SalaryTier>("dim_salary_tier.json")
  const skillsDim = readJsonData<Skill>("dim_skill.json")
  const jobSkills = readJsonData<JobSkill>("job_skill.json")

  const cityNameMap = new Map(cities.map((city) => [city.city_id, city.city_name]))
  const salaryTierNameMap = new Map(
    salaryTiersDim.map((tier) => [tier.salary_tier_id, tier.tier_name])
  )
  const skillNameMap = new Map(skillsDim.map((skill) => [skill.skill_id, skill.skill_name]))

  const totalJobs = factJobs.length
  const totalCities = new Set(factJobs.map((job) => job.city_id).filter(Boolean)).size
  const validSalaryJobs = factJobs.filter(
    (job) => toNumber(job.salary_valid) === 1 && job.salary_mid !== null && job.salary_mid !== undefined
  )
  const avgSalary = avg(validSalaryJobs.map((job) => toNumber(job.salary_mid)))

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

  const cityJobs = Array.from(cityGroup.entries())
    .map(([cityId, item]) => ({
      city: cityNameMap.get(cityId) ?? "未知",
      jobs: item.jobs,
      salary: avg(item.salaries),
    }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 10)

  const salaryTierGroup = new Map<number, number>()
  for (const job of factJobs) {
    if (!job.salary_tier_id) continue
    salaryTierGroup.set(job.salary_tier_id, (salaryTierGroup.get(job.salary_tier_id) ?? 0) + 1)
  }

  const salaryTiers = Array.from(salaryTierGroup.entries())
    .map(([tierId, count]) => ({
      range: salaryTierNameMap.get(tierId) ?? "未知",
      value: count,
      percentage: totalJobs ? round1((count / totalJobs) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)

  const skillGroup = new Map<number, number>()
  for (const item of jobSkills) {
    if (!item.skill_id) continue
    skillGroup.set(item.skill_id, (skillGroup.get(item.skill_id) ?? 0) + 1)
  }

  const skills = Array.from(skillGroup.entries())
    .map(([skillId, count]) => ({
      skill: skillNameMap.get(skillId) ?? "未知",
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  const topCity = cityJobs[0]
  const topSalaryTier = salaryTiers[0]
  const topSkill = skills[0]
  const topThreeCityJobs = cityJobs.slice(0, 3).reduce((sum, item) => sum + item.jobs, 0)

  return {
    summary: {
      totalJobs,
      totalCities,
      avgSalary,
      totalSkills: skillsDim.length,
    },
    cityJobs,
    salaryTiers,
    skills,
    insights: {
      topCity: topCity?.city ?? "未知",
      topCityJobs: topCity?.jobs ?? 0,
      topCityShare: topCity && totalJobs ? round1((topCity.jobs / totalJobs) * 100) : 0,
      topCityGroupShare: totalJobs ? round1((topThreeCityJobs / totalJobs) * 100) : 0,
      topSalaryTier: topSalaryTier?.range ?? "未知",
      topSalaryTierShare: topSalaryTier?.percentage ?? 0,
      topSkill: topSkill?.skill ?? "未知",
      topSkillCount: topSkill?.count ?? 0,
    },
  }
}