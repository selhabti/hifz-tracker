import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView
} from 'react-native'
import { useApp } from '../../src/context/AppContext'
import { getSessionInfo, getTodaysParts } from '../../src/utils/cycle'
import { getHijri, HIJRI_MONTHS } from '../../src/utils/hijri'
import { getJuz, progressHizb, hizbDone, getHizbStart, SURAH_NAMES_FR } from '../../src/data/hizbSurahMap'

export default function JadwalScreen() {
  const { state } = useApp()
  const info = getSessionInfo(state.dateOffset)
  const h = info.hijri
  const monthLen = h.month % 2 ? 30 : 29

  // Compute streak
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const dayData = state.sessionDays[ds]
    if (dayData && dayData.length > 0) streak++
    else if (i > 0) break
  }

  const days = []
  for (let d = 1; d <= monthLen; d++) {
    const session = d <= 10 ? 1 : (d <= 20 ? 2 : 3)
    const sDay = d <= 10 ? d : (d <= 20 ? d - 10 : d - 20)
    if (session === info.session) {
      const parts = getTodaysParts(sDay - 1, state.hizbsPerDay, state.activeCycleHizbs, state.memorizedParts)
      const done = parts.filter(id => state.memorizedParts.includes(id)).length
      const byHizb: Record<number, number[]> = {}
      parts.forEach(id => {
        const hh = Math.floor(id / 100)
        if (!byHizb[hh]) byHizb[hh] = []
        byHizb[hh].push(id)
      })
      days.push({ day: d, sDay, parts: parts.length, done, hizbs: Object.keys(byHizb).map(Number).sort((a, b) => a - b) })
    }
  }

  const allTodayDone = days.filter(day => day.day === h.day).every(day => day.parts > 0 && day.done === day.parts)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.monthName}>{HIJRI_MONTHS[h.month - 1]} {h.year}</Text>
          <Text style={styles.sessionInfo}>{info.label} — {info.range}</Text>
          <View style={styles.streakRow}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{streak} jours consécutifs</Text>
          </View>
        </View>

        <View style={styles.weekRow}>
          {['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'].map(d => (
            <Text key={d} style={styles.weekDay}>{d}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {days.map(day => {
            const firstJD = getHijri(state.dateOffset)
            const isToday = day.day === h.day
            const allDone = day.parts > 0 && day.done === day.parts
            return (
              <View
                key={day.day}
                style={[
                  styles.dayCell,
                  isToday && styles.dayToday,
                  allDone && styles.dayDone,
                ]}
              >
                <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>{day.day}</Text>
                <Text style={styles.dayCount}>
                  {day.done}/{day.parts}
                </Text>
                {day.hizbs.length > 0 && (
                  <Text style={styles.dayHizbs} numberOfLines={1}>
                    {day.hizbs.join(',')}
                  </Text>
                )}
              </View>
            )
          })}
        </View>

        <Text style={styles.sectionTitle}>أحزاب الدورة</Text>
        {days.filter(d => d.hizbs.length > 0).map(day => (
          <View key={day.day} style={styles.dayDetail}>
            <Text style={styles.dayDetailTitle}>
              Jour {day.sDay} ({day.day} {HIJRI_MONTHS[h.month - 1]})
            </Text>
            <View style={styles.dayDetailHizbs}>
              {day.hizbs.map(hh => {
                const start = getHizbStart(hh)
                return (
                  <View key={hh} style={styles.hizbChip}>
                    <Text style={styles.hizbChipText}>H{hh}</Text>
                    <Text style={styles.hizbChipSurah}>{SURAH_NAMES_FR[start.surah - 1]}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  scroll: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 16 },
  monthName: { fontSize: 22, fontWeight: '700', color: '#1B5E20' },
  sessionInfo: { fontSize: 14, color: '#666', marginTop: 2 },
  streakRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  streakIcon: { fontSize: 16 },
  streakText: { fontSize: 13, color: '#666', fontWeight: '500' },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 11, color: '#999', paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayToday: { backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: '#2E7D32' },
  dayDone: { backgroundColor: '#C8E6C9' },
  dayNum: { fontSize: 14, fontWeight: '600', color: '#333' },
  dayNumToday: { color: '#2E7D32' },
  dayCount: { fontSize: 9, color: '#999', marginTop: 1 },
  dayHizbs: { fontSize: 7, color: '#2E7D32', marginTop: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 16, marginBottom: 8 },
  dayDetail: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  dayDetailTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  dayDetailHizbs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  hizbChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  hizbChipText: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  hizbChipSurah: { fontSize: 10, color: '#666' },
})
