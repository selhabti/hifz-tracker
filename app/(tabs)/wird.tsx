import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl
} from 'react-native'
import { useApp } from '../../src/context/AppContext'
import { getSessionInfo, getTodaysParts } from '../../src/utils/cycle'
import { getHijri, HIJRI_MONTHS } from '../../src/utils/hijri'
import { progressHizb } from '../../src/data/hizbSurahMap'
import HizbCard from '../../src/components/HizbCard'
import BottomSheet from '../../src/components/BottomSheet'
import ProgressRing from '../../src/components/ProgressRing'
import { WEEKDAYS } from '../../src/utils/storage'

export default function WirdScreen() {
  const {
    state, loading, ensureCycle,
    markGhayban, markMushahada, markPartiel, markSurah
  } = useApp()

  const [refreshing, setRefreshing] = useState(false)
  const [bsHizb, setBsHizb] = useState<number | null>(null)
  const [bsVisible, setBsVisible] = useState(false)

  useEffect(() => {
    if (!loading) ensureCycle()
  }, [loading])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    ensureCycle()
    setRefreshing(false)
  }, [ensureCycle])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    )
  }

  const info = getSessionInfo(state.dateOffset)
  const h = info.hijri
  const today = new Date()
  const todayStr = `${WEEKDAYS[today.getDay()]} ${h.day}`
  const sessionDayIdx = info.sessionDay - 1
  const todayParts = getTodaysParts(sessionDayIdx, state.hizbsPerDay, state.activeCycleHizbs, state.memorizedParts)
  const doneToday = todayParts.filter(id => state.memorizedParts.includes(id))
  const totalParts = todayParts.length
  const doneCount = doneToday.length

  // Group by hizb
  const byHizb: Record<number, number[]> = {}
  todayParts.forEach(id => {
    const hh = Math.floor(id / 100)
    if (!byHizb[hh]) byHizb[hh] = []
    byHizb[hh].push(id)
  })
  const hizbNums = Object.keys(byHizb).map(Number).sort((a, b) => a - b)

  const progress = totalParts > 0 ? doneCount / totalParts : 0

  const handlePress = (h: number) => {
    setBsHizb(h)
    setBsVisible(true)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.dayName}>{todayStr}</Text>
              <Text style={styles.dayNum}>{info.label} · Jour {info.sessionDay}</Text>
              <Text style={styles.hijri}>{h.day} {HIJRI_MONTHS[h.month - 1]} {h.year}</Text>
            </View>
            <View style={styles.cycleBadge}>
              <Text style={styles.cycleBadgeText}>Cycle {getCycleNumber(state.dateOffset)}</Text>
            </View>
          </View>
          <View style={styles.heroCenter}>
            <ProgressRing progress={progress} size={80} label={`${doneCount}/${totalParts}`} />
            <Text style={styles.heroTitle}>الورد اليومي</Text>
            <Text style={styles.heroSub}>{info.label} · {info.range} — Cycle {getCycleNumber(state.dateOffset)}</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>📌</Text>
          <Text style={styles.infoText}>Clique sur un hizb pour enregistrer ta révision.</Text>
        </View>

        {/* Hizb List */}
        <Text style={styles.sectionTitle}>أحزاب اليوم ({hizbNums.length})</Text>
        {hizbNums.map(h => (
          <HizbCard
            key={h}
            hizb={h}
            memorizedHizbs={state.memorizedHizbs}
            progress={progressHizb(h, state.memorizedParts)}
            onPress={() => handlePress(h)}
          />
        ))}
        {hizbNums.length === 0 && (
          <Text style={styles.emptyText}>Aucun hizb à réviser aujourd'hui. Tous les hizbs sont mémorisés !</Text>
        )}
      </ScrollView>

      <BottomSheet
        visible={bsVisible}
        hizb={bsHizb}
        onClose={() => setBsVisible(false)}
        onGhayban={() => { if (bsHizb) { markGhayban(bsHizb); setBsVisible(false) } }}
        onMushahada={() => { if (bsHizb) { markMushahada(bsHizb); setBsVisible(false) } }}
        onPartiel={(n) => { if (bsHizb) { markPartiel(bsHizb, n); setBsVisible(false) } }}
        onSurah={() => { if (bsHizb) { markSurah(bsHizb); setBsVisible(false) } }}
      />
    </SafeAreaView>
  )
}

function getCycleNumber(dateOffset: number): number {
  const h = getHijri(dateOffset)
  if (!h) return 1
  const session = h.day <= 10 ? 1 : (h.day <= 20 ? 2 : 3)
  const monthIndex = (h.year - 1448) * 12 + h.month
  return (monthIndex - 1) * 3 + session
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  scroll: { padding: 16, paddingBottom: 100 },
  loadingText: { textAlign: 'center', marginTop: 40, color: '#999' },
  hero: {
    backgroundColor: '#1B5E20',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayName: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  dayNum: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 2 },
  hijri: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 1 },
  cycleBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cycleBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heroCenter: { alignItems: 'center', marginTop: 12 },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 8 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.3)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  infoIcon: { fontSize: 16 },
  infoText: { fontSize: 12, color: '#8D6E00', flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
})
