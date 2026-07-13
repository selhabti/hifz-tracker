import { getHijri } from './hijri'

export function getCycleNumber(dateOffset: number = 0): number {
  const h = getHijri(dateOffset)
  if (!h) return 1
  const session = h.day <= 10 ? 1 : (h.day <= 20 ? 2 : 3)
  const monthIndex = (h.year - 1448) * 12 + h.month
  return (monthIndex - 1) * 3 + session
}

export function getSessionInfo(dateOffset: number = 0) {
  const h = getHijri(dateOffset)
  const s = h.day <= 10 ? 1 : (h.day <= 20 ? 2 : 3)
  const sDay = h.day <= 10 ? h.day : (h.day <= 20 ? h.day - 10 : h.day - 20)
  const monthLen = h.month % 2 ? 30 : 29
  return {
    hijri: h,
    session: s,
    sessionDay: sDay,
    label: `Session ${s}`,
    range: s === 1 ? '1-10' : (s === 2 ? '11-20' : `21-${monthLen}`)
  }
}

export function getTodaysParts(
  dayOffset: number,
  hizbsPerDay: number,
  activeCycleHizbs: number[],
  memorized: number[]
): number[] {
  const PARTS_PER_HIZB = 8
  const pool = activeCycleHizbs.length > 0 ? activeCycleHizbs : getRemainingHizbs(memorized)
  const all: number[] = []
  pool.forEach(h => {
    for (let p = 1; p <= PARTS_PER_HIZB; p++) {
      const id = h * 100 + p
      if (!memorized.includes(id)) all.push(id)
    }
  })
  const perDay = hizbsPerDay * PARTS_PER_HIZB
  const start = dayOffset * perDay
  return all.slice(start, start + perDay)
}

export function getRemainingHizbs(memorized: number[]): number[] {
  const res: number[] = []
  for (let h = 1; h <= 60; h++) {
    const parts: number[] = []
    for (let p = 1; p <= 8; p++) parts.push(h * 100 + p)
    if (!parts.every(id => memorized.includes(id))) res.push(h)
  }
  return res
}
