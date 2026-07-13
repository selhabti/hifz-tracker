import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { getHizbStart, getJuz, SURAH_NAMES_AR, SURAH_NAMES_FR } from '../data/hizbSurahMap'

interface HizbCardProps {
  hizb: number
  memorizedHizbs: number[]
  progress: number // 0..8
  onPress: () => void
}

export default function HizbCard({ hizb, memorizedHizbs, progress, onPress }: HizbCardProps) {
  const isMemorized = memorizedHizbs.includes(hizb)
  const start = getHizbStart(hizb)

  return (
    <TouchableOpacity
      style={[styles.card, isMemorized && styles.memorized]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.numBadge, isMemorized && styles.numBadgeMemorized]}>
        <Text style={styles.numText}>{hizb}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {SURAH_NAMES_AR[start.surah - 1]}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {SURAH_NAMES_FR[start.surah - 1]} · Juz' {getJuz(hizb)}
        </Text>
        {isMemorized && <Text style={styles.badge}>★ Mémorisé</Text>}
      </View>
      <View style={styles.right}>
        <View style={[styles.progressBadge, isMemorized && styles.progressBadgeMemorized]}>
          <Text style={[styles.progressText, isMemorized && styles.progressTextMemorized]}>
            {isMemorized ? '★' : `${progress}/8`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  memorized: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  numBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numBadgeMemorized: {
    backgroundColor: '#FFC107',
  },
  numText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sub: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF8F00',
    marginTop: 2,
  },
  right: {
    marginLeft: 8,
  },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  progressBadgeMemorized: {
    backgroundColor: '#FFC107',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  progressTextMemorized: {
    color: '#fff',
  },
})
