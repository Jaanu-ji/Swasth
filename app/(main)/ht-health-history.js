import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import figmaTokens from '../../design-system/figmaTokens';

export default function HealthHistory() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={figmaTokens.colors.gray900}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health History</Text>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <View style={styles.graphPlaceholder}>
          <Text style={styles.graphText}>Graphs will appear here 📈</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            No historical data yet.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: figmaTokens.colors.gray50,
  },

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
    color: figmaTokens.colors.gray900,
  },

  body: {
    padding: figmaTokens.spacing['6'],
  },

  graphPlaceholder: {
    height: 180,
    backgroundColor: figmaTokens.colors.gray100,
    borderRadius: figmaTokens.borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: figmaTokens.spacing['6'],
  },
  graphText: {
    color: figmaTokens.colors.gray500,
  },

  card: {
    backgroundColor: figmaTokens.colors.white,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
  },
  cardText: {
    color: figmaTokens.colors.gray600,
  },
});
