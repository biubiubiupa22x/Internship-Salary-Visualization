import { readJsonData, toNumber } from "@/lib/json-data"

export interface EducationDistributionDatum {
  name: string
  value: number
  percentage: number
}

export interface EducationSalaryDatum {
  education: string
  salary: number
  trend: number
}

export interface EducationFlowLink {
  source: string
  target: string
  value: number
}

export interface EducationCompetitivenessDatum {
  title: string
  education: string
  experience: string
  skills: number
  score: number
  salary: number
}

export interface EducationAnalysisData {
  distribution: EducationDistributionDatum[]
  salary: EducationSalaryDatum[]
  flowLinks: EducationFlowLink[]
  competitiveness: EducationCompetitivenessDatum[]
}

type FactJob = {
  job_id: number
  job_title?: string | null
  education_id?: number | null
  experience?: string | null
  salary_mid?: number | null
  salary_valid?: number | null
  salary_tier_id?: number | null
  competitiveness_score?: number | null
}

type Education = {
  education_id: number
  education_name: string
  edu_score: number
}

type SalaryTier = {
  salary_tier_id: number
  tier_name: string
}

type JobSkill = {
  job_id: number
  skill_id: number
}

function round1(value: number): number {
  return Number(value.toFixed(1))
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

export function getEducationAnalysisData(): EducationAnalysisData {
  const factJobs = readJsonData<FactJob>("fact_job.json")
  const educations = readJsonData<Education>("dim_education.json")
  const salaryTiers = readJsonData<SalaryTier>("dim_salary_tier.json")
  const jobSkills = readJsonData<JobSkill>("job_skill.json")

  const educationMap = new Map(educations.map((item) => [item.education_id, item]))
  const salaryTierMap = new Map(salaryTiers.map((item) => [item.salary_tier_id, item.tier_name]))
  const skillCountMap = new Map<number, number>()

  for (const item of jobSkills) {
    skillCountMap.set(item.job_id, (skillCountMap.get(item.job_id) ?? 0) + 1)
  }

  const educationCountMap = new Map<number, number>()
  const educationSalaryMap = new Map<number, number[]>()
  const flowMap = new Map<string, { source: string; target: string; value: number }>()

  for (const job of factJobs) {
    if (!job.education_id) continue

    educationCountMap.set(job.education_id, (educationCountMap.get(job.education_id) ?? 0) + 1)

    if (toNumber(job.salary_valid) === 1 && job.salary_mid !== null && job.salary_mid !== undefined) {
      educationSalaryMap.set(job.education_id, [
        ...(educationSalaryMap.get(job.education_id) ?? []),
        toNumber(job.salary_mid),
      ])
    }

    const education = educationMap.get(job.education_id)
    const tierName = job.salary_tier_id ? salaryTierMap.get(job.salary_tier_id) : undefined
    if (education && tierName) {
      const key = `${education.education_name}|||${tierName}`
      const current = flowMap.get(key) ?? { source: education.education_name, target: tierName, value: 0 }
      current.value += 1
      flowMap.set(key, current)
    }
  }

  const distribution = Array.from(educationCountMap.entries())
    .map(([educationId, value]) => {
      const education = educationMap.get(educationId)
      return {
        name: education?.education_name ?? "未知",
        value,
        percentage: factJobs.length ? round1((value / factJobs.length) * 100) : 0,
        score: education?.edu_score ?? -1,
      }
    })
    .filter((item) => item.name !== "未知")
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...item }) => item)

  const salary = Array.from(educationSalaryMap.entries())
    .map(([educationId, values]) => {
      const education = educationMap.get(educationId)
      const avgSalary = values.length ? round1(values.reduce((sum, value) => sum + value, 0) / values.length) : 0
      return {
        education: education?.education_name ?? "未知",
        salary: avgSalary,
        trend: avgSalary,
        score: education?.edu_score ?? -1,
      }
    })
    .filter((item) => item.education !== "未知")
    .sort((a, b) => a.score - b.score)
    .map(({ score: _score, ...item }) => item)

  const flowLinks = Array.from(flowMap.values())
    .sort((a, b) => {
      const targetOrder = salaryTierOrder(a.target) - salaryTierOrder(b.target)
      if (targetOrder !== 0) return targetOrder
      return b.value - a.value
    })

  const validScatterJobs = factJobs.filter(
    (job) => toNumber(job.salary_valid) === 1 && job.salary_mid !== null && job.salary_mid !== undefined
  )
  const sampleStep = Math.max(1, Math.floor(validScatterJobs.length / 450))

  const competitiveness = validScatterJobs
    .filter((_, index) => index % sampleStep === 0)
    .slice(0, 500)
    .map((job) => {
      const education = job.education_id ? educationMap.get(job.education_id) : undefined
      return {
        title: job.job_title ?? "未命名岗位",
        education: education?.education_name ?? "未知",
        experience: job.experience ?? "不限",
        skills: skillCountMap.get(job.job_id) ?? 0,
        score: round1(toNumber(job.competitiveness_score)),
        salary: round1(toNumber(job.salary_mid)),
      }
    })

  return { distribution, salary, flowLinks, competitiveness }
}
