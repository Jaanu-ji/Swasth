// ✅ Dashboard Screen - Built from Figma
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchChatHistory, fetchDietHistory } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';
import figmaTokens from '../../design-system/figmaTokens';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [dietCount, setDietCount] = useState(0);

  useEffect(() => {
    if (user?.email) {
      loadCounts();
    }
  }, [user?.email]);

  const loadCounts = async () => {
    try {
      const chats = await fetchChatHistory(user.email);
      const diets = await fetchDietHistory(user.email);
      setChatCount(chats?.length || 0);
      setDietCount(diets?.length || 0);
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await loadCounts();
    setRefreshing(false);
  };

  const quickStats = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', icon: 'heart-pulse', color: figmaTokens.colors.rose100, iconColor: figmaTokens.colors.rose600 },
    { label: 'Steps Today', value: '8,234', unit: 'steps', icon: 'walk', color: figmaTokens.colors.blue100, iconColor: figmaTokens.colors.blue600 },
    { label: 'Water Intake', value: '6', unit: '/ 8 cups', icon: 'cup-water', color: figmaTokens.colors.cyan100, iconColor: figmaTokens.colors.cyan600 },
    { label: 'Calories', value: '1,450', unit: '/ 2000', icon: 'fire', color: figmaTokens.colors.green100, iconColor: figmaTokens.colors.green600 },
  ];

  const mainFeatures = [
    { title: 'Health Tracker', icon: 'heart-pulse', screen: 'health-tracker', color: figmaTokens.colors.rose500 },
    { title: 'Family Profiles', icon: 'account-group', screen: 'family', color: figmaTokens.colors.blue500 },
    { title: 'Meal Planner', icon: 'food-apple', screen: 'diet', color: figmaTokens.colors.green500 },
    { title: 'Fitness', icon: 'dumbbell', screen: 'profile', color: figmaTokens.colors.orange500 },
    { title: 'Analytics', icon: 'chart-line', screen: 'profile', color: figmaTokens.colors.purple500 },
    { title: 'Reminders', icon: 'bell', screen: 'profile', color: figmaTokens.colors.yellow500 },
  ];

  const extraFeatures = [
    { title: 'Emergency Card', icon: 'shield', screen: 'emergency' },
    { title: 'AI Suggestions', icon: 'lightbulb-on', screen: 'ai-insights' },
    { title: 'Report Scanner', icon: 'file-document', screen: 'ocr' },
  ];

  const handleNavigate = (screen) => {
    router.push(`/(main)/${screen}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[figmaTokens.colors.blue500, figmaTokens.colors.purple500]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
                <MaterialCommunityIcons name="bell" size={24} color={figmaTokens.colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.quickStatsGrid}>
              {quickStats.map((stat, index) => (
                <View key={index} style={styles.quickStatCard}>
                  <View style={styles.quickStatHeader}>
                    <View style={[styles.quickStatIconBg, { backgroundColor: stat.color }]}>
                      <MaterialCommunityIcons name={stat.icon} size={16} color={stat.iconColor} />
                    </View>
                    <Text style={styles.quickStatLabel}>{stat.label}</Text>
                  </View>
                  <View style={styles.quickStatValue}>
                    <Text style={styles.quickStatValueText}>{stat.value}</Text>
                    <Text style={styles.quickStatUnit}>{stat.unit}</Text>
                  </View>
                </View>
              ))}
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Main Features</Text>
            <View style={styles.mainFeaturesGrid}>
              {mainFeatures.map((feature, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleNavigate(feature.screen)}
                  style={styles.mainFeatureCard}
                  activeOpacity={0.7}
                >
                  <View style={[styles.mainFeatureIconBg, { backgroundColor: feature.color }]}>
                    <MaterialCommunityIcons name={feature.icon} size={24} color={figmaTokens.colors.white} />
                  </View>
                  <Text style={styles.mainFeatureTitle}>{feature.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>More Features</Text>
            <View style={styles.extraFeaturesList}>
              {extraFeatures.map((feature, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleNavigate(feature.screen)}
                  style={styles.extraFeatureCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.extraFeatureLeft}>
                    <View style={styles.extraFeatureIconBg}>
                      <MaterialCommunityIcons name={feature.icon} size={24} color={figmaTokens.colors.gray700} />
                    </View>
                    <Text style={styles.extraFeatureTitle}>{feature.title}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={figmaTokens.colors.gray400} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: figmaTokens.colors.gray50,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: figmaTokens.spacing['6'],
    paddingBottom: figmaTokens.spacing['6'],
    paddingHorizontal: figmaTokens.spacing['6'],
    borderBottomLeftRadius: figmaTokens.borderRadius['3xl'],
    borderBottomRightRadius: figmaTokens.borderRadius['3xl'],
    ...figmaTokens.shadows.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: figmaTokens.spacing['6'],
  },
  greeting: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.white,
    marginBottom: figmaTokens.spacing['1'],
  },
  userName: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.blue100,
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: figmaTokens.borderRadius.full,
    padding: figmaTokens.spacing['3'],
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: figmaTokens.spacing['3'],
  },
  quickStatCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
  },
  quickStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['2'],
    marginBottom: figmaTokens.spacing['2'],
  },
  quickStatIconBg: {
    borderRadius: figmaTokens.borderRadius.base,
    padding: 6,
  },
  quickStatLabel: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickStatValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  quickStatValueText: {
    fontSize: figmaTokens.typography.fontSize['2xl'],
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.white,
  },
  quickStatUnit: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: figmaTokens.spacing['1'],
  },
  content: {
    padding: figmaTokens.spacing['6'],
  },
  sectionTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    marginBottom: figmaTokens.spacing['4'],
  },
  mainFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: figmaTokens.spacing['4'],
    marginBottom: figmaTokens.spacing['6'],
  },
  mainFeatureCard: {
    width: '30%',
    backgroundColor: figmaTokens.colors.white,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
    ...figmaTokens.shadows.sm,
    alignItems: 'center',
  },
  mainFeatureIconBg: {
    borderRadius: figmaTokens.borderRadius.xl,
    padding: figmaTokens.spacing['3'],
    marginBottom: figmaTokens.spacing['3'],
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainFeatureTitle: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    textAlign: 'center',
  },
  extraFeaturesList: {
    gap: figmaTokens.spacing['3'],
  },
  extraFeatureCard: {
    width: '100%',
    backgroundColor: figmaTokens.colors.white,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
    ...figmaTokens.shadows.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  extraFeatureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['3'],
    flex: 1,
  },
  extraFeatureIconBg: {
    backgroundColor: figmaTokens.colors.gray100,
    borderRadius: figmaTokens.borderRadius.xl,
    padding: figmaTokens.spacing['3'],
  },
  extraFeatureTitle: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
});

