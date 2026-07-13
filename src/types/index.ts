export interface AppState {
  memorizedParts: number[]
  sessionDays: Record<string, number[]>
  dateOffset: number
  hizbsPerDay: number
  daysPerCycle: number
  startingHizb: number
  darkMode: boolean
  activeCycleHizbs: number[]
  lastCycleNumber: number
  memorizedHizbs: number[]
  username: string
  reviewLog: ReviewEntry[]
  ghaybanCount: number
  mushahadaCount: number
}

export interface ReviewEntry {
  date: string
  hizb: number
  type: 'ghayban' | 'mushahada' | 'partiel' | 'surah'
  partsDone: number
}

export interface HizbInfo {
  startSurah: number
  startVerse: number
  endSurah: number
  endVerse: number
}

export interface SurahInfo {
  name: string
  ayahs: number
}

export interface SessionInfo {
  session: number
  sessionDay: number
  hijri: HijriDate
  label: string
  range: string
}

export interface HijriDate {
  year: number
  month: number
  day: number
}
