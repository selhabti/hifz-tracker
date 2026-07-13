import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from '../types'

const STORAGE_KEY = 'hifzV3'

export function defaultState(): AppState {
  return {
    memorizedParts: [],
    sessionDays: {},
    dateOffset: 0,
    hizbsPerDay: 6,
    daysPerCycle: 10,
    startingHizb: 1,
    darkMode: false,
    activeCycleHizbs: [],
    lastCycleNumber: 0,
    memorizedHizbs: [],
    username: '',
    reviewLog: [],
    ghaybanCount: 0,
    mushahadaCount: 0,
  }
}

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw) as AppState
      if (!s.sessionDays) s.sessionDays = {}
      if (s.hizbsPerDay === undefined) s.hizbsPerDay = 6
      if (s.daysPerCycle === undefined) s.daysPerCycle = 10
      if (s.startingHizb === undefined) s.startingHizb = 1
      if (s.activeCycleHizbs === undefined) s.activeCycleHizbs = []
      if (s.lastCycleNumber === undefined) s.lastCycleNumber = 0
      if (s.memorizedHizbs === undefined) s.memorizedHizbs = []
      if (s.username === undefined) s.username = ''
      if (s.reviewLog === undefined) s.reviewLog = []
      if (s.ghaybanCount === undefined) s.ghaybanCount = 0
      if (s.mushahadaCount === undefined) s.mushahadaCount = 0
      if (s.memorizedParts === undefined && (s as any).memorized) {
        const old = (s as any).memorized as number[]
        const parts: number[] = []
        old.forEach((h: number) => {
          for (let p = 1; p <= 8; p++) parts.push(h * 100 + p)
        })
        s.memorizedParts = parts
      }
      return s
    }
  } catch (e) {
    console.warn('Failed to load state', e)
  }
  return defaultState()
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Failed to save state', e)
  }
}

export function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const WEEKDAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
