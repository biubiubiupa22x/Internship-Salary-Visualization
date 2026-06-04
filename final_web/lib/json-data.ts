import fs from "node:fs"
import path from "node:path"

export function readJsonData<T = any>(fileName: string): T[] {
  const filePath = path.join(process.cwd(), "public", "data", fileName)

  if (!fs.existsSync(filePath)) {
    console.warn(`Data file not found: ${filePath}`)
    return []
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw) as T[]
  } catch (error) {
    console.error(`Failed to read JSON file: ${fileName}`, error)
    return []
  }
}

export function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}