import { readJsonData } from "@/lib/json-data"

export interface SkillDatum {
  skill: string
  count: number
}

export interface SkillWordDatum {
  text: string
  value: number
  category: string
  x: number
  y: number
}

export interface SkillLinkDatum {
  source: string
  target: string
  value: number
}

export interface SkillNodeDatum {
  id: string
  x: number
  y: number
  group: number
  value: number
}

export interface SkillAnalysisData {
  rank: SkillDatum[]
  words: SkillWordDatum[]
  heatmapSkills: string[]
  heatmapMatrix: number[][]
  networkNodes: SkillNodeDatum[]
  networkLinks: SkillLinkDatum[]
}

type Skill = {
  skill_id: number
  skill_name: string
}

type JobSkill = {
  job_id: number
  skill_id: number
}

const WORD_POSITIONS = [
  [48, 42],
  [30, 28],
  [64, 62],
  [28, 58],
  [70, 30],
  [50, 74],
  [18, 38],
  [82, 50],
  [38, 80],
  [78, 76],
  [16, 72],
  [84, 22],
  [12, 22],
  [90, 66],
  [58, 16],
  [10, 52],
] as const

const NODE_POSITIONS = [
  [250, 180],
  [250, 58],
  [365, 88],
  [430, 178],
  [372, 285],
  [250, 318],
  [128, 285],
  [70, 178],
  [135, 88],
  [315, 155],
  [330, 225],
  [250, 255],
  [170, 225],
  [185, 155],
  [250, 112],
] as const

function skillCategory(skill: string): string {
  if (/Java|Python|C\+\+|iOS|前端|后端/.test(skill)) return "lang"
  if (/算法|机器学习|大模型|数据挖掘|计算机视觉/.test(skill)) return "algo"
  if (/产品|运营|UI/.test(skill)) return "skill"
  if (/测试|运维|嵌入式|数仓/.test(skill)) return "tool"
  return "domain"
}

function makePairKey(a: string, b: string): string {
  return [a, b].sort().join("|||")
}

export function getSkillAnalysisData(): SkillAnalysisData {
  const skillsDim = readJsonData<Skill>("dim_skill.json")
  const jobSkills = readJsonData<JobSkill>("job_skill.json")

  const skillNameMap = new Map(skillsDim.map((skill) => [skill.skill_id, skill.skill_name]))

  const skillCountMap = new Map<number, number>()
  for (const item of jobSkills) {
    if (!item.skill_id) continue
    skillCountMap.set(item.skill_id, (skillCountMap.get(item.skill_id) ?? 0) + 1)
  }

  const skillRows = Array.from(skillCountMap.entries())
    .map(([skillId, count]) => ({
      skill_name: skillNameMap.get(skillId) ?? "未知",
      skill_count: count,
    }))
    .filter((item) => item.skill_name !== "未知")
    .sort((a, b) => b.skill_count - a.skill_count)

  const jobToSkills = new Map<number, string[]>()
  for (const item of jobSkills) {
    const skillName = skillNameMap.get(item.skill_id)
    if (!skillName) continue

    const current = jobToSkills.get(item.job_id) ?? []
    current.push(skillName)
    jobToSkills.set(item.job_id, current)
  }

  const linkCountMap = new Map<string, number>()
  for (const skills of jobToSkills.values()) {
    const uniqueSkills = Array.from(new Set(skills))

    for (let i = 0; i < uniqueSkills.length; i++) {
      for (let j = i + 1; j < uniqueSkills.length; j++) {
        const key = makePairKey(uniqueSkills[i], uniqueSkills[j])
        linkCountMap.set(key, (linkCountMap.get(key) ?? 0) + 1)
      }
    }
  }

  const links = Array.from(linkCountMap.entries())
    .map(([key, count]) => {
      const [source_skill, target_skill] = key.split("|||")
      return {
        source_skill,
        target_skill,
        cooccurrence_count: count,
      }
    })
    .sort((a, b) => b.cooccurrence_count - a.cooccurrence_count)

  const rank = skillRows.slice(0, 12).map((item) => ({
    skill: item.skill_name,
    count: item.skill_count,
  }))

  const words = skillRows.slice(0, 16).map((item, index) => ({
    text: item.skill_name,
    value: item.skill_count,
    category: skillCategory(item.skill_name),
    x: WORD_POSITIONS[index]?.[0] ?? 50,
    y: WORD_POSITIONS[index]?.[1] ?? 50,
  }))

  const heatmapSkills = skillRows.slice(0, 15).map((item) => item.skill_name)
  const skillFrequencyMap = new Map(
    skillRows.map((item) => [item.skill_name, item.skill_count])
  )

  const linkMap = new Map<string, number>()
  links.forEach((link) => {
    linkMap.set(`${link.source_skill}|||${link.target_skill}`, link.cooccurrence_count)
    linkMap.set(`${link.target_skill}|||${link.source_skill}`, link.cooccurrence_count)
  })

  const heatmapMatrix = heatmapSkills.map((rowSkill) =>
    heatmapSkills.map((colSkill) => {
      if (rowSkill === colSkill) return skillFrequencyMap.get(rowSkill) ?? 0
      return linkMap.get(`${rowSkill}|||${colSkill}`) ?? 0
    })
  )

  const networkSkills = skillRows.slice(0, 15).map((item) => item.skill_name)
  const networkSkillSet = new Set(networkSkills)

  const networkNodes = networkSkills.map((skill, index) => {
    const source = skillRows.find((item) => item.skill_name === skill)

    return {
      id: skill,
      x: NODE_POSITIONS[index]?.[0] ?? 250,
      y: NODE_POSITIONS[index]?.[1] ?? 180,
      group: (index % 5) + 1,
      value: source?.skill_count ?? 0,
    }
  })

  const networkLinks = links
    .filter((link) => networkSkillSet.has(link.source_skill) && networkSkillSet.has(link.target_skill))
    .slice(0, 18)
    .map((link) => ({
      source: link.source_skill,
      target: link.target_skill,
      value: link.cooccurrence_count,
    }))

  return {
    rank,
    words,
    heatmapSkills,
    heatmapMatrix,
    networkNodes,
    networkLinks,
  }
}