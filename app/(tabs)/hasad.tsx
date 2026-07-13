import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useApp } from '../../src/context/AppContext'
import { getJuz, progressHizb, hizbDone, totalHizbsDone, getHizbStart, SURAH_NAMES_FR, SURAH_NAMES_AR } from '../../src/data/hizbSurahMap'

export default function HasadScreen() {
  const { state, resetAll } = useApp()
  const memCount = state.memorizedHizbs.length
  const totalH = totalHizbsDone(state.memorizedParts)
  const pct = Math.round((memCount / 60) * 100)

  // Pie chart
  const size = 120
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (memCount / 60) * circumference

  // Milestones
  const ghaybanMilestones = [10, 30, 50, 100, 200, 360]
  const nextMilestone = ghaybanMilestones.find(m => (state.ghaybanCount || 0) < m)
  const milestoneProgress = nextMilestone ? (state.ghaybanCount || 0) / nextMilestone : 1

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>الحصاد</Text>

        {/* Pie */}
        <View style={styles.pieCard}>
          <View style={styles.pieWrap}>
            <Svg width={size} height={size}>
              <Circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8F5E9" strokeWidth={stroke} />
              <Circle
                cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#FFC107" strokeWidth={stroke}
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View style={styles.pieCenter}>
              <Text style={styles.pieVal}>{memCount}/60</Text>
              <Text style={styles.pieLabel}>مُحَصَّل</Text>
            </View>
          </View>
          <View style={styles.legend}>
            <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: '#FFC107' }]} /><Text style={styles.legendText}>مُحَصَّل (par cœur)</Text></View>
            <View style={styles.legendRow}><View style={[styles.dot, { backgroundColor: '#E8F5E9' }]} /><Text style={styles.legendText}>باقي (restants)</Text></View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatCard value={`${totalH}/60`} label="أحزاب كاملة" />
          <StatCard value={`${state.ghaybanCount || 0}`} label="غيباً" />
          <StatCard value={`${state.mushahadaCount || 0}`} label="مشاهدة" />
          <StatCard value={`${state.reviewLog.length}`} label="مراجعات" />
        </View>

        {/* Progress bar */}
        <View style={styles.progCard}>
          <Text style={styles.progText}>{pct}% — {memCount} / 60 أحزاب</Text>
          <View style={styles.progBar}>
            <View style={[styles.progFill, { width: `${pct}%` }]} />
          </View>
        </View>

        {/* Milestones */}
        <Text style={styles.sectionTitle}>المعالم (غيباً)</Text>
        <View style={styles.milestones}>
          {ghaybanMilestones.map(m => {
            const reached = (state.ghaybanCount || 0) >= m
            return (
              <View key={m} style={[styles.milestone, reached && styles.milestoneReached]}>
                <Text style={[styles.milestoneIcon, reached && styles.milestoneIconReached]}>
                  {reached ? '✓' : '○'}
                </Text>
                <Text style={[styles.milestoneText, reached && styles.milestoneTextReached]}>
                  {m} غيباً
                </Text>
              </View>
            )
          })}
        </View>

        {/* Hizb List */}
        <Text style={styles.sectionTitle}>قائمة الأحزاب</Text>
        {Array.from({ length: 60 }, (_, i) => i + 1).map(h => {
          const start = getHizbStart(h)
          const done = progressHizb(h, state.memorizedParts)
          const hDone = hizbDone(h, state.memorizedParts)
          const isMem = state.memorizedHizbs.includes(h)
          // Last review date
          const lastReview = state.reviewLog.filter(r => r.hizb === h).pop()
          return (
            <View key={h} style={[styles.hizbRow, (hDone || isMem) && styles.hizbRowDone]}>
              <View style={[styles.hizbNum, isMem && styles.hizbNumMem]}>
                <Text style={[styles.hizbNumText, isMem && styles.hizbNumTextMem]}>{h}</Text>
              </View>
              <View style={styles.hizbInfo}>
                <Text style={styles.hizbSurahAr}>{SURAH_NAMES_AR[start.surah - 1]}</Text>
                <Text style={styles.hizbSurahFr}>{SURAH_NAMES_FR[start.surah - 1]} · Juz' {getJuz(h)}</Text>
                <Text style={styles.hizbStats}>
                  {done}/8 · {isMem ? '★' : ''} غيباً:{state.reviewLog.filter(r => r.hizb === h && r.type === 'ghayban').length} مشاهدة:{state.reviewLog.filter(r => r.hizb === h && r.type === 'mushahada').length}
                </Text>
              </View>
              <View style={styles.hizbBar}>
                <View style={[styles.hizbBarFill, { width: `${(done / 8) * 100}%` }, isMem && { backgroundColor: '#FFC107' }]} />
              </View>
            </View>
          )
        })}

        {/* Reset */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => Alert.alert('Réinitialiser', 'Toutes les données seront effacées.', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Confirmer', style: 'destructive', onPress: resetAll },
          ])}
        >
          <Text style={styles.resetText}>🗑️ Réinitialiser toutes les données</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  scroll: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: '700', color: '#1B5E20', marginBottom: 12, textAlign: 'center' },
  pieCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  pieWrap: { position: 'relative', width: 120, height: 120, marginBottom: 12 },
  pieCenter: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  pieVal: { fontSize: 22, fontWeight: '800', color: '#1B5E20' },
  pieLabel: { fontSize: 10, color: '#999', marginTop: 2 },
  legend: { flexDirection: 'row', gap: 16 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#666' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  statVal: { fontSize: 20, fontWeight: '800', color: '#2E7D32' },
  statLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  progCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12 },
  progText: { fontSize: 13, color: '#666', marginBottom: 8 },
  progBar: { height: 8, backgroundColor: '#E8F5E9', borderRadius: 4 },
  progFill: { height: '100%', backgroundColor: '#2E7D32', borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, marginTop: 12 },
  milestones: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  milestoneReached: { backgroundColor: '#E8F5E9' },
  milestoneIcon: { fontSize: 14, color: '#ccc' },
  milestoneIconReached: { color: '#2E7D32' },
  milestoneText: { fontSize: 12, color: '#666' },
  milestoneTextReached: { color: '#2E7D32', fontWeight: '600' },
  hizbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
    gap: 10,
  },
  hizbRowDone: { backgroundColor: '#E8F5E9' },
  hizbNum: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
  },
  hizbNumMem: { backgroundColor: '#FFC107' },
  hizbNumText: { fontSize: 13, fontWeight: '700', color: '#2E7D32' },
  hizbNumTextMem: { color: '#fff' },
  hizbInfo: { flex: 1 },
  hizbSurahAr: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  hizbSurahFr: { fontSize: 10, color: '#999', marginTop: 1 },
  hizbStats: { fontSize: 9, color: '#666', marginTop: 1 },
  hizbBar: {
    width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2,
    overflow: 'hidden',
  },
  hizbBarFill: { height: '100%', backgroundColor: '#2E7D32', borderRadius: 2 },
  resetBtn: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e00',
    alignItems: 'center',
  },
  resetText: { color: '#e00', fontSize: 14, fontWeight: '600' },
})
