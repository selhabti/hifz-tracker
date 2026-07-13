import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { AppState, ReviewEntry } from '../types'
import { loadState, saveState, defaultState, getToday } from '../utils/storage'
import { getHijri } from '../utils/hijri'
import { getSessionInfo, getTodaysParts } from '../utils/cycle'
import { hizbParts, getSurahHizbs } from '../data/hizbSurahMap'

interface AppContextType {
  state: AppState
  loading: boolean
  markGhayban: (hizb: number) => Promise<void>
  markMushahada: (hizb: number) => Promise<void>
  markPartiel: (hizb: number, numParts: number) => Promise<void>
  markSurah: (hizb: number) => Promise<void>
  resetAll: () => Promise<void>
  setHizbsPerDay: (n: number) => Promise<void>
  setDaysPerCycle: (n: number) => Promise<void>
  setDateOffset: (n: number) => Promise<void>
  setUsername: (name: string) => Promise<void>
  setActiveCycleHizbs: (hizbs: number[]) => Promise<void>
  toggleDarkMode: () => Promise<void>
  ensureCycle: () => number[]
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadState().then(s => {
      setState(s)
      setLoading(false)
    })
  }, [])

  const persist = useCallback(async (newState: AppState) => {
    setState(newState)
    await saveState(newState)
  }, [])

  const ensureCycle = useCallback((): number[] => {
    const cycle = getCycleNumber(state.dateOffset)
    if (cycle !== state.lastCycleNumber) {
      const remaining: number[] = []
      for (let h = 1; h <= 60; h++) {
        const parts = hizbParts(h)
        const done = parts.every(id => state.memorizedParts.includes(id)) || state.memorizedHizbs.includes(h)
        if (!done) remaining.push(h)
      }
      const newState = { ...state, lastCycleNumber: cycle, activeCycleHizbs: remaining }
      setState(newState)
      saveState(newState)
      return remaining
    }
    return state.activeCycleHizbs
  }, [state])

  const addReview = useCallback(async (hizb: number, type: ReviewEntry['type'], partsDone: number) => {
    const today = getToday()
    const entry: ReviewEntry = { date: today, hizb, type, partsDone }
    const newState = { ...state }
    newState.reviewLog = [...newState.reviewLog, entry]
    if (!newState.sessionDays[today]) newState.sessionDays[today] = []
    // Mark parts
    for (let p = 1; p <= partsDone; p++) {
      const id = hizb * 100 + p
      if (!newState.memorizedParts.includes(id)) {
        newState.memorizedParts.push(id)
      }
      if (!newState.sessionDays[today].includes(id)) {
        newState.sessionDays[today].push(id)
      }
    }
    newState.memorizedParts.sort((a, b) => a - b)
    if (type === 'ghayban') {
      newState.ghaybanCount = (newState.ghaybanCount || 0) + 1
      if (!newState.memorizedHizbs.includes(hizb)) {
        newState.memorizedHizbs.push(hizb)
      }
    } else if (type === 'mushahada') {
      newState.mushahadaCount = (newState.mushahadaCount || 0) + 1
    }
    await persist(newState)
  }, [state, persist])

  const markGhayban = useCallback(async (hizb: number) => {
    await addReview(hizb, 'ghayban', 8)
  }, [addReview])

  const markMushahada = useCallback(async (hizb: number) => {
    await addReview(hizb, 'mushahada', 8)
  }, [addReview])

  const markPartiel = useCallback(async (hizb: number, numParts: number) => {
    await addReview(hizb, 'partiel', numParts)
  }, [addReview])

  const markSurah = useCallback(async (hizb: number) => {
    const surahHizbs = getSurahHizbs(hizb)
    const today = getToday()
    const newState = { ...state }
    newState.reviewLog = [...newState.reviewLog, { date: today, hizb, type: 'surah', partsDone: 0 }]
    if (!newState.sessionDays[today]) newState.sessionDays[today] = []
    surahHizbs.forEach(sh => {
      for (let p = 1; p <= 8; p++) {
        const id = sh * 100 + p
        if (!newState.memorizedParts.includes(id)) {
          newState.memorizedParts.push(id)
        }
        if (!newState.sessionDays[today].includes(id)) {
          newState.sessionDays[today].push(id)
        }
      }
    })
    newState.memorizedParts.sort((a, b) => a - b)
    await persist(newState)
  }, [state, persist])

  const resetAll = useCallback(async () => {
    const fresh = defaultState()
    await persist(fresh)
  }, [persist])

  const setHizbsPerDay = useCallback(async (n: number) => {
    await persist({ ...state, hizbsPerDay: n })
  }, [state, persist])

  const setDaysPerCycle = useCallback(async (n: number) => {
    await persist({ ...state, daysPerCycle: n })
  }, [state, persist])

  const setDateOffset = useCallback(async (n: number) => {
    await persist({ ...state, dateOffset: n })
  }, [state, persist])

  const setUsername = useCallback(async (name: string) => {
    await persist({ ...state, username: name })
  }, [state, persist])

  const setActiveCycleHizbs = useCallback(async (hizbs: number[]) => {
    await persist({ ...state, activeCycleHizbs: hizbs })
  }, [state, persist])

  const toggleDarkMode = useCallback(async () => {
    await persist({ ...state, darkMode: !state.darkMode })
  }, [state, persist])

  return (
    <AppContext.Provider value={{
      state, loading,
      markGhayban, markMushahada, markPartiel, markSurah,
      resetAll, setHizbsPerDay, setDaysPerCycle, setDateOffset,
      setUsername, setActiveCycleHizbs, toggleDarkMode, ensureCycle
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

function getCycleNumber(dateOffset: number): number {
  const h = getHijri(dateOffset)
  if (!h) return 1
  const session = h.day <= 10 ? 1 : (h.day <= 20 ? 2 : 3)
  const monthIndex = (h.year - 1448) * 12 + h.month
  return (monthIndex - 1) * 3 + session
}
