import { readJsonData, toNumber } from "@/lib/json-data"

export interface HeatmapRow {
  city: string
  values: number[]
}

export interface CompetitivenessPoint {
  score: number
  salary: number
  level: string
  title: string
  city: string
  education: string
  experience: string
  skillCount: number
}

export interface RadarDataPoint {
  dimension: string
  [city: string]: string | number
}

export interface FinalConclusionMetric {
  label: string
  value: string
  note: string
}

export interface FinalConclusion {
  text: string
  metrics: FinalConclusionMetric[]
}

export interface ConclusionData {
  salaryLevels: string[]
  citySalaryRows: HeatmapRow[]
  jobTypes: string[]
  cityJobRows: HeatmapRow[]
  competitiveness: CompetitivenessPoint[]
  correlationVars: string[]
  correlationData: number[][]
  radarCities: string[]
  radarData: RadarDataPoint[]
  insights: string[]
  finalConclusion: FinalConclusion
}

type FactJob = {
  job_id: number
  job_title?: string
  city_id: number
  education_id: number
  position_type_id: number
  search_keyword_id?: number | null
  salary_tier_id?: number | null
  salary_min?: number | null
  salary_max?: number | null
  salary_mid?: number | null
  salary_valid?: number | null
  competitiveness_score?: number | null
  edu_score?: number | null
  experience?: string | null
}

type City = {
  city_id: number
  city_name: string
}

type Education = {
  education_id: number
  education_name: string
  edu_score: number
}

type PositionType = {
  position_type_id: number
  type_name: string
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

function round2(value: number): number {
  return Number(value.toFixed(2))
}

function avg(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function tierSort(name: string): number {
  const order: Record<string, number> = {
    "3k以下": 1,
    "3-6k": 2,
    "6-10k": 3,
    "10-15k": 4,
    "15-20k": 5,
    "20k以上": 6,
  }

  return order[name] ?? 99
}

function scoreLevel(score: number): string {
  if (score >= 0.75) return "高门槛"
  if (score >= 0.55) return "较高门槛"
  if (score >= 0.35) return "中等门槛"
  return "基础门槛"
}

function correlation(xs: number[], ys: number[]): number {
  const pairs = xs
    .map((x, index) => [x, ys[index]] as const)
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y))

  if (pairs.length < 2) return 0

  const xValues = pairs.map(([x]) => x)
  const yValues = pairs.map(([, y]) => y)

  const xMean = avg(xValues)
  const yMean = avg(yValues)

  const numerator = pairs.reduce(
    (sum, [x, y]) => sum + (x - xMean) * (y - yMean),
    0
  )

  const xDen = Math.sqrt(
    xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0)
  )

  const yDen = Math.sqrt(
    yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0)
  )

  if (xDen === 0 || yDen === 0) return 0

  return round2(numerator / (xDen * yDen))
}

function normalize(value: number, min: number, max: number): number {
  if (max <= min) return 0.5
  return round2((value - min) / (max - min))
}

export function getConclusionData(): ConclusionData {
  const factJobs = readJsonData<FactJob>("fact_job.json")
  const cities = readJsonData<City>("dim_city.json")
  const educations = readJsonData<Education>("dim_education.json")
  const positionTypes = readJsonData<PositionType>("dim_position_type.json")
  const salaryTiersDim = readJsonData<SalaryTier>("dim_salary_tier.json")
  const skillsDim = readJsonData<Skill>("dim_skill.json")
  const jobSkills = readJsonData<JobSkill>("job_skill.json")

  const cityMap = new Map(cities.map((city) => [city.city_id, city.city_name]))
  const cityIdMap = new Map(cities.map((city) => [city.city_name, city.city_id]))
  const educationMap = new Map(
    educations.map((education) => [education.education_id, education])
  )
  const positionTypeMap = new Map(
    positionTypes.map((positionType) => [
      positionType.position_type_id,
      positionType.type_name,
    ])
  )
  const salaryTierMap = new Map(
    salaryTiersDim.map((tier) => [tier.salary_tier_id, tier.tier_name])
  )
  const skillMap = new Map(skillsDim.map((skill) => [skill.skill_id, skill.skill_name]))

  const totalJobs = factJobs.length
  const totalCities = new Set(factJobs.map((job) => job.city_id).filter(Boolean)).size

  const validSalaryJobs = factJobs.filter(
    (job) =>
      toNumber(job.salary_valid) === 1 &&
      job.salary_mid !== null &&
      job.salary_mid !== undefined
  )

  const avgSalary = round1(avg(validSalaryJobs.map((job) => toNumber(job.salary_mid))))

  const jobSkillCountMap = new Map<number, number>()
  for (const item of jobSkills) {
    jobSkillCountMap.set(item.job_id, (jobSkillCountMap.get(item.job_id) ?? 0) + 1)
  }

  const cityCountMap = new Map<number, number>()
  for (const job of factJobs) {
    if (!job.city_id) continue
    cityCountMap.set(job.city_id, (cityCountMap.get(job.city_id) ?? 0) + 1)
  }

  const topCities = Array.from(cityCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([cityId]) => cityMap.get(cityId) ?? "未知")
    .filter((city) => city !== "未知")

  /**
   * 1. 城市 × 薪资档位热力图
   */
  const salaryLevels = salaryTiersDim
    .map((tier) => tier.tier_name)
    .sort((a, b) => tierSort(a) - tierSort(b))

  const salaryTierNameToId = new Map(
    salaryTiersDim.map((tier) => [tier.tier_name, tier.salary_tier_id])
  )

  const citySalaryRows: HeatmapRow[] = topCities.map((cityName) => {
    const cityId = cityIdMap.get(cityName)

    return {
      city: cityName,
      values: salaryLevels.map((tierName) => {
        const tierId = salaryTierNameToId.get(tierName)

        return factJobs.filter(
          (job) => job.city_id === cityId && job.salary_tier_id === tierId
        ).length
      }),
    }
  })

  /**
   * 2. 城市 × 岗位类型热力图
   */
  const typeCountMap = new Map<number, number>()
  for (const job of factJobs) {
    if (!job.position_type_id) continue
    typeCountMap.set(
      job.position_type_id,
      (typeCountMap.get(job.position_type_id) ?? 0) + 1
    )
  }

  const jobTypes = Array.from(typeCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([typeId]) => positionTypeMap.get(typeId) ?? "未知")
    .filter((typeName) => typeName !== "未知")

  const typeNameToId = new Map(
    positionTypes.map((positionType) => [
      positionType.type_name,
      positionType.position_type_id,
    ])
  )

  const cityJobRows: HeatmapRow[] = topCities.map((cityName) => {
    const cityId = cityIdMap.get(cityName)

    return {
      city: cityName,
      values: jobTypes.map((typeName) => {
        const typeId = typeNameToId.get(typeName)

        return factJobs.filter(
          (job) => job.city_id === cityId && job.position_type_id === typeId
        ).length
      }),
    }
  })

  /**
   * 3. 竞争力评分与薪资关系
   */
  const scatterSource = validSalaryJobs
    .filter(
      (job) =>
        job.competitiveness_score !== null &&
        job.competitiveness_score !== undefined
    )
    .sort((a, b) => a.job_id - b.job_id)

  const step = Math.max(1, Math.floor(scatterSource.length / 320))
  const sampledScatter = scatterSource.filter((_, index) => index % step === 0).slice(0, 360)

  const competitiveness: CompetitivenessPoint[] = sampledScatter.map((job) => {
    const score = toNumber(job.competitiveness_score)
    const education = educationMap.get(job.education_id)

    return {
      score: round2(score),
      salary: round2(toNumber(job.salary_mid)),
      level: scoreLevel(score),
      title: job.job_title ?? "未知岗位",
      city: cityMap.get(job.city_id) ?? "未知",
      education: education?.education_name ?? "未知",
      experience: job.experience ?? "不限",
      skillCount: jobSkillCountMap.get(job.job_id) ?? 0,
    }
  })

  /**
   * 4. 数值变量相关性热力图
   */
  const correlationSource = validSalaryJobs
    .filter(
      (job) =>
        job.salary_min !== null &&
        job.salary_min !== undefined &&
        job.salary_max !== null &&
        job.salary_max !== undefined &&
        job.competitiveness_score !== null &&
        job.competitiveness_score !== undefined
    )
    .map((job) => {
      const education = educationMap.get(job.education_id)

      return {
        minSalary: toNumber(job.salary_min),
        maxSalary: toNumber(job.salary_max),
        avgSalary: toNumber(job.salary_mid),
        educationScore: toNumber(job.edu_score ?? education?.edu_score),
        competitivenessScore: toNumber(job.competitiveness_score),
        skillCount: jobSkillCountMap.get(job.job_id) ?? 0,
      }
    })

  const correlationVars = ["最低薪资", "最高薪资", "平均薪资", "学历分数", "竞争力评分", "技能数量"]

  const correlationFields = [
    { key: "minSalary", label: "最低薪资" },
    { key: "maxSalary", label: "最高薪资" },
    { key: "avgSalary", label: "平均薪资" },
    { key: "educationScore", label: "学历分数" },
    { key: "competitivenessScore", label: "竞争力评分" },
    { key: "skillCount", label: "技能数量" },
  ] as const

  const correlationData = correlationFields.map((rowField) =>
    correlationFields.map((colField) =>
      {
        const value = correlation(
        correlationSource.map((row) => row[rowField.key]),
        correlationSource.map((row) => row[colField.key])
        )
        return Math.abs(value) < 0.05 ? 0 : value
      }
    )
  )

  /**
   * 5. Top 城市综合画像雷达图
   */
  const cityMetricRows = Array.from(cityCountMap.entries())
    .map(([cityId, jobCount]) => {
      const cityJobs = factJobs.filter((job) => job.city_id === cityId)

      const salaryValues = cityJobs
        .filter(
          (job) =>
            toNumber(job.salary_valid) === 1 &&
            job.salary_mid !== null &&
            job.salary_mid !== undefined
        )
        .map((job) => toNumber(job.salary_mid))

      const educationValues = cityJobs.map((job) => {
        const education = educationMap.get(job.education_id)
        return toNumber(job.edu_score ?? education?.edu_score)
      })

      const skillValues = cityJobs.map((job) => jobSkillCountMap.get(job.job_id) ?? 0)

      const jobDiversity = new Set(
        cityJobs
          .map((job) => job.search_keyword_id)
          .filter((value) => value !== null && value !== undefined)
      ).size

      return {
        cityName: cityMap.get(cityId) ?? "未知",
        jobCount,
        avgSalary: avg(salaryValues),
        jobDiversity,
        avgEdu: avg(educationValues),
        avgSkillCount: avg(skillValues),
      }
    })
    .filter((row) => row.cityName !== "未知")
    .sort((a, b) => b.jobCount - a.jobCount)

  const radarSource = cityMetricRows.slice(0, 5)
  const radarCities = radarSource.map((row) => row.cityName)

  const radarDimensions = [
    { dimension: "实习岗位数量", key: "jobCount" },
    { dimension: "平均实习薪资", key: "avgSalary" },
    { dimension: "实习岗位丰富度", key: "jobDiversity" },
    { dimension: "学历门槛", key: "avgEdu" },
    { dimension: "技能数量", key: "avgSkillCount" },
  ] as const

  const radarData: RadarDataPoint[] = radarDimensions.map(({ dimension, key }) => {
    const values = radarSource.map((row) => toNumber(row[key]))
    const min = Math.min(...values)
    const max = Math.max(...values)

    const item: RadarDataPoint = {
      dimension,
    }

    for (const row of radarSource) {
      item[row.cityName] = normalize(toNumber(row[key]), min, max)
    }

    return item
  })

  /**
   * 6. Insights 与最终结论
   */
  const topCity = Array.from(cityCountMap.entries()).sort((a, b) => b[1] - a[1])[0]

  const salaryTierCountMap = new Map<number, number>()
  for (const job of factJobs) {
    if (!job.salary_tier_id) continue
    salaryTierCountMap.set(
      job.salary_tier_id,
      (salaryTierCountMap.get(job.salary_tier_id) ?? 0) + 1
    )
  }

  const topSalaryTier = Array.from(salaryTierCountMap.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0]

  const topPosition = Array.from(typeCountMap.entries()).sort((a, b) => b[1] - a[1])[0]

  const skillCountMap = new Map<number, number>()
  for (const item of jobSkills) {
    if (!item.skill_id) continue
    skillCountMap.set(item.skill_id, (skillCountMap.get(item.skill_id) ?? 0) + 1)
  }

  const topSkill = Array.from(skillCountMap.entries()).sort((a, b) => b[1] - a[1])[0]

  const topCityName = topCity ? cityMap.get(topCity[0]) ?? "未知" : "未知"
  const topCityJobs = topCity?.[1] ?? 0
  const topCityShare = totalJobs ? round1((topCityJobs / totalJobs) * 100) : 0

  const topSalaryTierName = topSalaryTier
    ? salaryTierMap.get(topSalaryTier[0]) ?? "未知"
    : "未知"
  const topSalaryTierJobs = topSalaryTier?.[1] ?? 0
  const topSalaryTierShare = totalJobs
    ? round1((topSalaryTierJobs / totalJobs) * 100)
    : 0

  const topPositionName = topPosition
    ? positionTypeMap.get(topPosition[0]) ?? "未知"
    : "未知"
  const topPositionJobs = topPosition?.[1] ?? 0
  const topPositionShare = totalJobs ? round1((topPositionJobs / totalJobs) * 100) : 0

  const topSkillName = topSkill ? skillMap.get(topSkill[0]) ?? "未知" : "未知"
  const topSkillCount = topSkill?.[1] ?? 0

  const insights = [
    `${topCityName}实习岗位数量最高，共 ${topCityJobs} 个，占全部样本的 ${topCityShare}%，城市集中度明显。`,
    `实习薪资档位以${topSalaryTierName}为主，共 ${topSalaryTierJobs} 个实习岗位，占比 ${topSalaryTierShare}%，样本薪资中枢集中在该区间。`,
    `${topPositionName}是需求量最高的实习岗位类型，共 ${topPositionJobs} 个实习岗位，占比 ${topPositionShare}%，体现当前实习招聘需求的主方向。`,
    `技能关键词中“${topSkillName}”出现 ${topSkillCount} 次，是当前实习岗位描述中最突出的能力标签。`,
  ]

  const finalConclusion: FinalConclusion = {
    text: `基于 ${totalJobs} 条真实实习岗位数据，当前 AI 相关实习招聘市场呈现出城市需求高度集中、实习薪资主要落在${topSalaryTierName}、岗位类型以${topPositionName}为核心的结构。综合城市、实习薪资、学历、技能和竞争力变量来看，实习机会选择应优先结合目标城市岗位密度、岗位类型热度和技能关键词进行规划。`,
    metrics: [
      { label: "实习岗位样本", value: `${totalJobs}`, note: "来自清洗后数据库" },
      { label: "覆盖城市", value: `${totalCities}`, note: "按城市维度聚合" },
      { label: "平均实习薪资", value: `${avgSalary}k`, note: "基于有效薪资字段" },
      { label: "技能关键词", value: `${skillsDim.length}`, note: "来自技能维表" },
    ],
  }

  return {
    salaryLevels,
    citySalaryRows,
    jobTypes,
    cityJobRows,
    competitiveness,
    correlationVars,
    correlationData,
    radarCities,
    radarData,
    insights,
    finalConclusion,
  }
}
