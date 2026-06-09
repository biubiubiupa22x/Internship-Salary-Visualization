import { readJsonData, toNumber } from "@/lib/json-data"

export interface JobDemandDatum {
  type: string
  count: number
}

export interface JobSalaryDatum {
  type: string
  salary: number
  count: number
  education: number
  level: string
}

export interface JobBubbleDatum {
  name: string
  count: number
  salary: number
  educationScore: number
}

export interface CityJobStructureDatum {
  city: string
  total: number
  [type: string]: string | number
}

export interface JobAnalysisData {
  demand: JobDemandDatum[]
  salary: JobSalaryDatum[]
  bubble: JobBubbleDatum[]
  cityStructure: CityJobStructureDatum[]
  stackTypes: string[]
}

type FactJob = {
  job_id: number
  city_id: number
  education_id: number
  position_type_id: number
  search_keyword_id?: number | null
  salary_mid?: number | null
  salary_valid?: number | null
}

type PositionType = {
  position_type_id: number
  type_name: string
}

type SearchKeyword = {
  keyword_id: number
  keyword: string
}

type Education = {
  education_id: number
  education_name: string
  edu_score: number
}

type City = {
  city_id: number
  city_name: string
}

function round2(value: number): number {
  return Number(value.toFixed(2))
}

function avg(values: number[]): number {
  if (!values.length) return 0
  return round2(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function educationLevel(score: number): string {
  if (score >= 2.2) return "硕士+"
  if (score >= 1.2) return "本科+"
  return "不限/大专+"
}

export function getJobAnalysisData(): JobAnalysisData {
  const factJobs = readJsonData<FactJob>("fact_job.json")
  const positionTypes = readJsonData<PositionType>("dim_position_type.json")
  const searchKeywords = readJsonData<SearchKeyword>("dim_search_keyword.json")
  const educations = readJsonData<Education>("dim_education.json")
  const cities = readJsonData<City>("dim_city.json")

  const positionTypeMap = new Map(
    positionTypes.map((item) => [item.position_type_id, item.type_name])
  )

  const searchKeywordMap = new Map(
    searchKeywords.map((item) => [item.keyword_id, item.keyword])
  )

  const educationMap = new Map(
    educations.map((item) => [item.education_id, item])
  )

  const cityMap = new Map(
    cities.map((item) => [item.city_id, item.city_name])
  )

  /**
   * 1. 岗位类型需求量排名
   */
  const typeCountMap = new Map<number, number>()

  for (const job of factJobs) {
    if (!job.position_type_id) continue
    typeCountMap.set(
      job.position_type_id,
      (typeCountMap.get(job.position_type_id) ?? 0) + 1
    )
  }

  const demand = Array.from(typeCountMap.entries())
    .map(([typeId, count]) => ({
      type: positionTypeMap.get(typeId) ?? "未知",
      count,
    }))
    .filter((item) => item.type !== "未知")
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  /**
   * 2. 实习岗位类型平均实习薪资排名
   */
  const typeSalaryMap = new Map<
    number,
    {
      count: number
      salaries: number[]
      eduScores: number[]
    }
  >()

  for (const job of factJobs) {
    if (!job.position_type_id) continue

    const current = typeSalaryMap.get(job.position_type_id) ?? {
      count: 0,
      salaries: [],
      eduScores: [],
    }

    current.count += 1

    if (
      toNumber(job.salary_valid) === 1 &&
      job.salary_mid !== null &&
      job.salary_mid !== undefined
    ) {
      current.salaries.push(toNumber(job.salary_mid))
    }

    const education = educationMap.get(job.education_id)
    if (education) {
      current.eduScores.push(toNumber(education.edu_score))
    }

    typeSalaryMap.set(job.position_type_id, current)
  }

  const salary = Array.from(typeSalaryMap.entries())
    .map(([typeId, item]) => {
      const avgSalary = avg(item.salaries)
      const avgEduScore = avg(item.eduScores)

      return {
        type: positionTypeMap.get(typeId) ?? "未知",
        salary: avgSalary,
        count: item.count,
        education: avgEduScore,
        level: educationLevel(avgEduScore),
      }
    })
    .filter((item) => item.type !== "未知")
    .filter((item) => item.count >= 5)
    .sort((a, b) => {
      if (b.salary !== a.salary) return b.salary - a.salary
      return b.count - a.count
    })
    .slice(0, 10)

  /**
   * 3. 实习岗位需求量 - 薪资 - 学历门槛气泡图
   *
   * 为了和原始分析图保持一致，这里按搜索岗位关键词聚合：
   * keyword / job_count / avg_salary / avg_education_score
   */
  const bubbleGroupMap = new Map<
    number,
    {
      count: number
      salaries: number[]
      eduScores: number[]
    }
  >()

  for (const job of factJobs) {
    if (!job.search_keyword_id) continue

    const current = bubbleGroupMap.get(job.search_keyword_id) ?? {
      count: 0,
      salaries: [],
      eduScores: [],
    }

    current.count += 1

    if (
      toNumber(job.salary_valid) === 1 &&
      job.salary_mid !== null &&
      job.salary_mid !== undefined
    ) {
      current.salaries.push(toNumber(job.salary_mid))
    }

    const education = educationMap.get(job.education_id)
    if (education) {
      current.eduScores.push(toNumber(education.edu_score))
    }

    bubbleGroupMap.set(job.search_keyword_id, current)
  }

  const bubbleAll = Array.from(bubbleGroupMap.entries())
    .map(([keywordId, item]) => ({
      name: searchKeywordMap.get(keywordId) ?? "未知",
      count: item.count,
      salary: avg(item.salaries),
      educationScore: avg(item.eduScores),
    }))
    .filter((item) => item.name !== "未知")
    .filter((item) => item.salary > 0)

  const topDemandBubble = bubbleAll
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  const highSalaryBubble = bubbleAll
    .filter((item) => item.count >= 5)
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 4)

  const bubble = Array.from(
    new Map([...topDemandBubble, ...highSalaryBubble].map((item) => [item.name, item])).values()
  )
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return b.salary - a.salary
    })

  /**
   * 4. 城市 x 岗位类型结构热力图
   *
   * 为了和原始分析图保持一致，这里使用搜索岗位关键词作为横轴。
   * 每行按当前展示的岗位关键词重新归一化，因此百分比之和约为 100%。
   */
  const cityCountMap = new Map<number, number>()

  for (const job of factJobs) {
    if (!job.city_id) continue
    cityCountMap.set(job.city_id, (cityCountMap.get(job.city_id) ?? 0) + 1)
  }

  const topCityIds = Array.from(cityCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([cityId]) => cityId)

  const keywordCountMap = new Map<number, number>()
  for (const job of factJobs) {
    if (!job.search_keyword_id) continue
    keywordCountMap.set(
      job.search_keyword_id,
      (keywordCountMap.get(job.search_keyword_id) ?? 0) + 1
    )
  }

  const topKeywordIds = Array.from(keywordCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([keywordId]) => keywordId)

  const stackTypes = topKeywordIds
    .map((keywordId) => searchKeywordMap.get(keywordId) ?? "未知")
    .filter((name) => name !== "未知")

  const cityStructure = topCityIds.map((cityId) => {
    const item: CityJobStructureDatum = {
      city: cityMap.get(cityId) ?? "未知",
      total: 0,
    }

    for (const typeName of stackTypes) {
      item[typeName] = 0
    }

    for (const job of factJobs) {
      if (job.city_id !== cityId) continue

      const typeName = job.search_keyword_id
        ? searchKeywordMap.get(job.search_keyword_id)
        : undefined
      if (!typeName || !stackTypes.includes(typeName)) continue

      item[typeName] = toNumber(item[typeName]) + 1
      item.total += 1
    }

    return item
  })

  return {
    demand,
    salary,
    bubble,
    cityStructure,
    stackTypes,
  }
}
