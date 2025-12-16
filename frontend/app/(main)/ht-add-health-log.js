import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import figmaTokens from '../../design-system/figmaTokens';

const VITALS = [
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', icon: 'heart-pulse' },
  { key: 'bloodPressure', label: 'Blood Pressure', unit: 'mmHg', icon: 'activity' },
  { key: 'weight', label: 'Weight', unit: 'kg', icon: 'scale-bathroom' },
  { key: 'temperature', label: 'Temperature', unit: '°F', icon: 'thermometer' },
];

export default function AddHealthLog() {
  const router = useRouter();
  const [selected, setSelected] = useState(VITALS[0]);
  const [value, setValue] = useState('');
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');

  const onSave = () => {
    // 🔌 backend next step
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Health Log</Text>
      </View>

      <View style={styles.body}>
        {/* VITAL TYPE */}
        <Text style={styles.label}>Vital Type</Text>
        <View style={styles.vitalRow}>
          {VITALS.map(v => (
            <TouchableOpacity
              key={v.key}
              onPress={() => setSelected(v)}
              style={[
                styles.vitalChip,
                selected.key === v.key && styles.vitalChipActive,
              ]}
            >
              <MaterialCommunityIcons
                name={v.icon}
                size={16}
                color={
                  selected.key === v.key
                    ? figmaTokens.colors.white
                    : figmaTokens.colors.gray600
                }
              />
              <Text
                style={[
                  styles.vitalChipText,
                  selected.key === v.key && styles.vitalChipTextActive,
                ]}
              >
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* VALUE INPUT */}
        <Text style={styles.label}>Value</Text>

        {selected.key === 'bloodPressure' ? (
          <View style={styles.bpRow}>
            <TextInput
              placeholder="Sys"
              keyboardType="numeric"
              value={sys}
              onChangeText={setSys}
              style={styles.input}
            />
            <TextInput
              placeholder="Dia"
              keyboardType="numeric"
              value={dia}
              onChangeText={setDia}
              style={styles.input}
            />
          </View>
        ) : (
          <View style={styles.singleRow}>
            <TextInput
              placeholder={`Enter ${selected.label}`}
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
              style={styles.input}
            />
            <Text style={styles.unit}>{selected.unit}</Text>
          </View>
        )}

        {/* SAVE */}
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <MaterialCommunityIcons
            name="check"
            size={18}
            color={figmaTokens.colors.white}
          />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: figmaTokens.colors.gray50 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: figmaTokens.spacing['6'],
    backgroundColor: figmaTokens.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: figmaTokens.colors.gray200,
  },
  headerTitle: {
    fontSize: figmaTokens.typography.fontSize.lg,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },

  body: { padding: figmaTokens.spacing['6'] },

  label: {
    marginBottom: 6,
    color: figmaTokens.colors.gray700,
  },

  vitalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: figmaTokens.spacing['6'],
  },
  vitalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: figmaTokens.borderRadius.xl,
    backgroundColor: figmaTokens.colors.gray100,
  },
  vitalChipActive: {
    backgroundColor: figmaTokens.colors.blue500,
  },
  vitalChipText: {
    color: figmaTokens.colors.gray700,
    fontSize: figmaTokens.typography.fontSize.sm,
  },
  vitalChipTextActive: {
    color: figmaTokens.colors.white,
  },

  bpRow: { flexDirection: 'row', gap: 12 },
  singleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: figmaTokens.spacing['6'],
  },

  input: {
    flex: 1,
    backgroundColor: figmaTokens.colors.white,
    borderRadius: figmaTokens.borderRadius.xl,
    padding: figmaTokens.spacing['4'],
  },
  unit: { color: figmaTokens.colors.gray500 },

  saveButton: {
    marginTop: figmaTokens.spacing['8'],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: figmaTokens.colors.blue500,
    paddingVertical: 16,
    borderRadius: figmaTokens.borderRadius['2xl'],
  },
  saveText: {
    color: figmaTokens.colors.white,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
});
