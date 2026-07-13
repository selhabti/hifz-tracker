import { HijriDate } from '../types'

export function hijriLeapYear(y: number): boolean {
  return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(y % 30)
}

export function hijriMonthLen(y: number, m: number): number {
  if (m <= 11) return m % 2 ? 30 : 29
  return hijriLeapYear(y) ? 30 : 29
}

export function gregToJD(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12)
  const Y = y + 4800 - a
  const M = m + 12 * a - 3
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045
}

export function jdToHijri(jd: number): HijriDate {
  const e = 1948438
  let y = 1
  let d = jd - e
  while (d >= 354 + (hijriLeapYear(y) ? 1 : 0)) {
    d -= 354 + (hijriLeapYear(y) ? 1 : 0)
    y++
  }
  let m = 1
  while (d >= hijriMonthLen(y, m)) {
    d -= hijriMonthLen(y, m)
    m++
  }
  return { year: y, month: m, day: d + 1 }
}

export function getHijri(offset: number = 0): HijriDate {
  const n = new Date()
  return jdToHijri(gregToJD(n.getFullYear(), n.getMonth() + 1, n.getDate()) + offset)
}

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi ath-Thani',
  'Jumada al-Ula', 'Jumada ath-Thaniya', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
]
