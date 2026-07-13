import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TextInput, TouchableOpacity, Alert, Switch
} from 'react-native'
import { useApp } from '../../src/context/AppContext'
import { getHijri, HIJRI_MONTHS } from '../../src/utils/hijri'

export default function SettingsScreen() {
  const {
    state, setHizbsPerDay, setDaysPerCycle, setDateOffset,
    setUsername, setActiveCycleHizbs, toggleDarkMode, resetAll, ensureCycle
  } = useApp()

  const [hpd, setHpd] = useState(String(state.hizbsPerDay))
  const [dpc, setDpc] = useState(String(state.daysPerCycle))
  const [uname, setUname] = useState(state.username)
  const [offset, setOffset] = useState(String(state.dateOffset))

  const h = getHijri(state.dateOffset)

  const saveHizbsPerDay = async () => {
    const n = parseInt(hpd) || 6
    setHpd(String(n))
    await setHizbsPerDay(Math.max(1, Math.min(10, n)))
  }

  const saveDaysPerCycle = async () => {
    const n = parseInt(dpc) || 10
    setDpc(String(n))
    await setDaysPerCycle(Math.max(1, Math.min(60, n)))
  }

  const saveOffset = async () => {
    const n = parseInt(offset) || 0
    setOffset(String(n))
    await setDateOffset(n)
  }

  const saveUname = async () => {
    await setUsername(uname)
  }

  const resetPlan = async () => {
    Alert.alert('Réinitialiser le plan', 'Cela effacera les hizbs sélectionnés pour ce cycle.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', style: 'destructive', onPress: async () => {
        await setActiveCycleHizbs([])
        ensureCycle()
      }},
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>الإعدادات</Text>

        {/* Username */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>المستخدم</Text>
          <TextInput
            style={styles.input}
            value={uname}
            onChangeText={setUname}
            onBlur={saveUname}
            placeholder="Ton nom"
            placeholderTextColor="#ccc"
          />
        </View>

        {/* Planning */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>التخطيط</Text>
          <View style={styles.row}>
            <Text style={styles.label}>أحزاب في اليوم</Text>
            <TextInput
              style={styles.inputSmall}
              value={hpd}
              onChangeText={setHpd}
              onBlur={saveHizbsPerDay}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>أيام في الدورة</Text>
            <TextInput
              style={styles.inputSmall}
              value={dpc}
              onChangeText={setDpc}
              onBlur={saveDaysPerCycle}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.group}>
          <Text style={styles.groupTitle}>التقويم</Text>
          <Text style={styles.currentDate}>
            Aujourd'hui : {h.day} {HIJRI_MONTHS[h.month - 1]} {h.year}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>تصحيح التاريخ (±jours)</Text>
            <TextInput
              style={styles.inputSmall}
              value={offset}
              onChangeText={setOffset}
              onBlur={saveOffset}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Dark Mode */}
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.label}>الوضع الليلي</Text>
            <Switch
              value={state.darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#ddd', true: '#81C784' }}
              thumbColor={state.darkMode ? '#2E7D32' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Reset */}
        <View style={styles.group}>
          <TouchableOpacity style={styles.resetBtn} onPress={resetPlan}>
            <Text style={styles.resetBtnText}>⟳ إعادة تعيين خطة الدورة</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.resetBtn, styles.resetDanger]}
            onPress={() => Alert.alert('Réinitialiser', 'Toutes les données seront effacées.', [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Confirmer', style: 'destructive', onPress: resetAll },
            ])}
          >
            <Text style={styles.resetDangerText}>🗑️ حذف جميع البيانات</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F0' },
  scroll: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: '700', color: '#1B5E20', marginBottom: 16, textAlign: 'center' },
  group: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  groupTitle: { fontSize: 14, fontWeight: '700', color: '#999', marginBottom: 12, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: { fontSize: 15, color: '#333', flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 8,
    fontSize: 15,
    color: '#333',
    width: 70,
    textAlign: 'center',
  },
  currentDate: { fontSize: 14, color: '#666', marginBottom: 8 },
  resetBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
    marginBottom: 8,
  },
  resetBtnText: { color: '#2E7D32', fontSize: 14, fontWeight: '600' },
  resetDanger: { borderColor: '#e00' },
  resetDangerText: { color: '#e00', fontSize: 14, fontWeight: '600' },
})
