// ✅ Diet Screen - Built from Figma MealPlanner.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateDiet, fetchDietHistory } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';
import figmaTokens from '../../design-system/figmaTokens';
import { HeaderBar } from '../../design-system/HeaderBar';
import { FigmaCard } from '../../design-system/FigmaCard';
import { FigmaButton } from '../../design-system/FigmaButton';
import { useRouter } from 'expo-router';

export default function DietScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const [planData, setPlanData] = useState(null);
  const fade = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (user?.email) {
      loadDietHistory();
    }
  }, [user?.email]);

  const loadDietHistory = async () => {
    try {
      const history = await fetchDietHistory(user.email);
      if (history && history.length > 0) {
        const latest = history[0];
        setPlan(latest.plan || '');
        setPlanData(latest);
        Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      }
    } catch (error) {
      console.error('Error loading diet:', error);
    }
  };

  const handleGenerate = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const response = await generateDiet(user.email);
      setPlan(response.plan || '');
      setPlanData(response);
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } catch (error) {
      console.error('Error generating diet:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = planData?.calories || 1470;
  const calorieGoal = 2000;
  const progress = Math.min((totalCalories / calorieGoal) * 100, 100);

  const todaysMeals = plan ? [
    { type: 'Breakfast', icon: 'coffee', time: '8:00 AM', meal: 'Oatmeal with berries', calories: 320, color: figmaTokens.colors.amber500 },
    { type: 'Lunch', icon: 'silverware-fork-knife', time: '1:00 PM', meal: 'Grilled chicken salad', calories: 450, color: figmaTokens.colors.green500 },
    { type: 'Snack', icon: 'food-apple', time: '4:00 PM', meal: 'Greek yogurt & almonds', calories: 180, color: figmaTokens.colors.orange500 },
    { type: 'Dinner', icon: 'moon-waning-crescent', time: '7:00 PM', meal: 'Salmon with vegetables', calories: 520, color: figmaTokens.colors.blue500 },
  ] : [];

  const quickActions = [
    { title: 'Calorie Tracker', description: 'Track daily calories', icon: '🔥', screen: 'profile' },
    { title: 'Water Tracker', description: 'Monitor hydration', icon: '💧', screen: 'profile' },
    { title: 'Recipes', description: 'Healthy meal ideas', icon: '📖', screen: 'profile' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <HeaderBar
          title="Meal Planner"
          onBack={() => router.back()}
          backgroundColor={figmaTokens.colors.white}
        />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {plan && (
              <>
                {/* Calorie Summary - EXACT Figma lines 69-87 */}
                <LinearGradient
                  colors={[figmaTokens.colors.green500, figmaTokens.colors.emerald500]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.calorieCard}
                >
                  <Text style={styles.calorieTitle}>Today's Progress</Text>
                  <View style={styles.calorieStats}>
                    <View>
                      <Text style={styles.calorieValue}>{totalCalories}</Text>
                      <Text style={styles.calorieLabel}>of {calorieGoal} calories</Text>
                    </View>
                    <View style={styles.calorieRemaining}>
                      <Text style={styles.calorieRemainingValue}>{calorieGoal - totalCalories}</Text>
                      <Text style={styles.calorieLabel}>remaining</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                  </View>
                </LinearGradient>

                {/* Quick Actions - EXACT Figma lines 89-101 */}
                <View style={styles.quickActionsGrid}>
                  {quickActions.map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickActionCard}
                      onPress={() => router.push(`/(main)/${action.screen}`)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                      <Text style={styles.quickActionTitle}>{action.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Today's Meals - EXACT Figma lines 103-139 */}
                <View style={styles.mealsSection}>
                  <View style={styles.mealsHeader}>
                    <Text style={styles.mealsTitle}>Today's Meals</Text>
                    <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                      <MaterialCommunityIcons name="plus" size={16} color={figmaTokens.colors.white} />
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.mealsList}>
                    {todaysMeals.map((meal, index) => (
                      <View key={index} style={styles.mealCard}>
                        <View style={[styles.mealIconBg, { backgroundColor: meal.color }]}>
                          <MaterialCommunityIcons name={meal.icon} size={24} color={figmaTokens.colors.white} />
                        </View>
                        <View style={styles.mealContent}>
                          <View style={styles.mealHeader}>
                            <Text style={styles.mealType}>{meal.type}</Text>
                            <Text style={styles.mealTime}>• {meal.time}</Text>
                          </View>
                          <Text style={styles.mealName}>{meal.meal}</Text>
                        </View>
                        <View style={styles.mealCalories}>
                          <Text style={styles.mealCaloriesValue}>{meal.calories}</Text>
                          <Text style={styles.mealCaloriesLabel}>cal</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}

            {!plan && !loading && (
              <View style={styles.generateSection}>
                <FigmaButton
                  title="Generate Diet Plan"
                  onPress={handleGenerate}
                  fullWidth
                  style={styles.generateButton}
                />
              </View>
            )}

            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={figmaTokens.colors.green500} />
                <Text style={styles.loaderText}>Generating your personalized diet plan...</Text>
              </View>
            )}

            {plan && (
              <Animated.View style={{ opacity: fade, marginTop: figmaTokens.spacing['6'] }}>
                <FigmaCard style={styles.planCard}>
                  <Text style={styles.planText}>{plan}</Text>
                </FigmaCard>
              </Animated.View>
            )}
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
  content: {
    padding: figmaTokens.spacing['6'],
  },
  calorieCard: {
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['6'],
    marginBottom: figmaTokens.spacing['6'],
  },
  calorieTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.white,
    marginBottom: figmaTokens.spacing['4'],
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: figmaTokens.spacing['3'],
  },
  calorieValue: {
    fontSize: figmaTokens.typography.fontSize['3xl'],
    fontWeight: figmaTokens.typography.fontWeight.bold,
    color: figmaTokens.colors.white,
    marginBottom: figmaTokens.spacing['1'],
  },
  calorieRemaining: {
    alignItems: 'flex-end',
  },
  calorieRemainingValue: {
    fontSize: figmaTokens.typography.fontSize['2xl'],
    fontWeight: figmaTokens.typography.fontWeight.bold,
    color: figmaTokens.colors.white,
    marginBottom: figmaTokens.spacing['1'],
  },
  calorieLabel: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.green100,
  },
  progressBarBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: figmaTokens.borderRadius.full,
    height: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: figmaTokens.colors.white,
    height: '100%',
    borderRadius: figmaTokens.borderRadius.full,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: figmaTokens.spacing['3'],
    marginBottom: figmaTokens.spacing['6'],
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: figmaTokens.colors.white,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
    alignItems: 'center',
    ...figmaTokens.shadows.sm,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: figmaTokens.spacing['2'],
  },
  quickActionTitle: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    textAlign: 'center',
  },
  mealsSection: {
    marginBottom: figmaTokens.spacing['6'],
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: figmaTokens.spacing['4'],
  },
  mealsTitle: {
    fontSize: figmaTokens.typography.fontSize.xl,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
  addButton: {
    backgroundColor: figmaTokens.colors.green500,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: figmaTokens.spacing['4'],
    paddingVertical: figmaTokens.spacing['2'],
    borderRadius: figmaTokens.borderRadius.xl,
    gap: figmaTokens.spacing['2'],
  },
  addButtonText: {
    color: figmaTokens.colors.white,
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
  mealsList: {
    gap: figmaTokens.spacing['3'],
  },
  mealCard: {
    backgroundColor: figmaTokens.colors.white,
    borderRadius: figmaTokens.borderRadius['2xl'],
    padding: figmaTokens.spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['4'],
    ...figmaTokens.shadows.sm,
  },
  mealIconBg: {
    borderRadius: figmaTokens.borderRadius.xl,
    padding: figmaTokens.spacing['3'],
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['2'],
    marginBottom: figmaTokens.spacing['1'],
  },
  mealType: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
  mealTime: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray500,
  },
  mealName: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
  },
  mealCalories: {
    alignItems: 'flex-end',
  },
  mealCaloriesValue: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
  },
  mealCaloriesLabel: {
    fontSize: figmaTokens.typography.fontSize.sm,
    color: figmaTokens.colors.gray500,
  },
  generateSection: {
    marginTop: figmaTokens.spacing['12'],
  },
  generateButton: {
    marginBottom: figmaTokens.spacing['6'],
  },
  loader: {
    alignItems: 'center',
    marginTop: figmaTokens.spacing['12'],
    gap: figmaTokens.spacing['4'],
  },
  loaderText: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
  },
  planCard: {
    marginBottom: figmaTokens.spacing['6'],
  },
  planText: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray700,
    lineHeight: figmaTokens.typography.lineHeight.normal * figmaTokens.typography.fontSize.base,
  },
});

