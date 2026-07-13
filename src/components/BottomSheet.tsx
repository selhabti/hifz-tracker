import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Pressable, ScrollView
} from 'react-native'
import { getHizbStart, getHizbEnd, getJuz, SURAH_NAMES_AR, SURAH_NAMES_FR } from '../data/hizbSurahMap'

interface BottomSheetProps {
  visible: boolean
  hizb: number | null
  onClose: () => void
  onGhayban: () => void
  onMushahada: () => void
  onPartiel: (numParts: number) => void
  onSurah: () => void
}

const FRACTIONS = [
  { label: '1/8', parts: 1, symbol: '⅛' },
  { label: '1/4', parts: 2, symbol: '¼' },
  { label: '3/8', parts: 3, symbol: '⅜' },
  { label: '1/2', parts: 4, symbol: '½' },
  { label: '5/8', parts: 5, symbol: '⅝' },
  { label: '3/4', parts: 6, symbol: '¾' },
  { label: '7/8', parts: 7, symbol: '⅞' },
  { label: '1 hizb', parts: 8, symbol: '1' },
]

export default function BottomSheet({
  visible, hizb, onClose, onGhayban, onMushahada, onPartiel, onSurah
}: BottomSheetProps) {
  const [showFractions, setShowFractions] = useState(false)

  if (!hizb) return null
  const start = getHizbStart(hizb)
  const end = getHizbEnd(hizb)

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Hizb {hizb}</Text>
          <Text style={styles.subtitle}>
            {SURAH_NAMES_AR[start.surah - 1]} · {SURAH_NAMES_FR[start.surah - 1]}
            {' — '}Juz' {getJuz(hizb)}
          </Text>
          <Text style={styles.range}>
            {start.surah === end.surah ? '' : `${SURAH_NAMES_FR[start.surah - 1]} → `}
            v.{start.verse}–{end.verse}
            {start.surah !== end.surah ? ` (${SURAH_NAMES_FR[end.surah - 1]})` : ''}
          </Text>

          {!showFractions ? (
            <View style={styles.actions}>
              <ActionButton num="1" title="غيباً" sub="Par cœur" color="#2E7D32" bg="#E8F5E9" onPress={onGhayban} />
              <ActionButton num="2" title="مشاهدة" sub="En lisant" color="#E65100" bg="#FFF3E0" onPress={onMushahada} />
              <ActionButton num="3" title="جزء من الحزب" sub="Une partie" color="#1565C0" bg="#E3F2FD" onPress={() => setShowFractions(true)} />
              <ActionButton num="4" title="سورة كاملة" sub="Sourate complète" color="#C62828" bg="#FCE4EC" onPress={onSurah} />
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setShowFractions(false)}>
                <Text style={styles.backText}>← Retour aux options</Text>
              </TouchableOpacity>
              <View style={styles.fractionGrid}>
                {FRACTIONS.map(f => (
                  <TouchableOpacity
                    key={f.parts}
                    style={styles.fractionBtn}
                    onPress={() => { onPartiel(f.parts); setShowFractions(false) }}
                  >
                    <Text style={styles.fractionSymbol}>{f.symbol}</Text>
                    <Text style={styles.fractionLabel}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function ActionButton({ num, title, sub, color, bg, onPress }: {
  num: string; title: string; sub: string; color: string; bg: string; onPress: () => void
}) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionNum, { backgroundColor: color }]}>
        <Text style={styles.actionNumText}>{num}</Text>
      </View>
      <View style={styles.actionText}>
        <Text style={[styles.actionTitle, { color }]}>{title}</Text>
        <Text style={styles.actionSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 24,
    marginTop: 2,
  },
  range: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  actionNum: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionSub: {
    fontSize: 12,
    color: '#999',
    marginTop: 1,
  },
  backBtn: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  backText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  fractionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  fractionBtn: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  fractionSymbol: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7B1FA2',
  },
  fractionLabel: {
    fontSize: 10,
    color: '#4A148C',
    marginTop: 2,
  },
})
