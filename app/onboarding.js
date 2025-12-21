// ✅ Onboarding Screen - Built from Figma
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import figmaTokens from '../design-system/figmaTokens';

const onboardingScreens = [
  {
    icon: 'heart',
    title: 'Your Health, Our Priority',
    description: 'Track your health vitals, monitor progress, and stay on top of your wellness journey.',
    color: figmaTokens.colors.rose500,
  },
  {
    icon: 'account-group',
    title: 'Manage Family Health',
    description: 'Keep track of your entire family\'s health records, vaccinations, and appointments in one place.',
    color: figmaTokens.colors.blue500,
  },
  {
    icon: 'dumbbell',
    title: 'Fitness & Nutrition',
    description: 'Plan meals, track calories, monitor workouts, and achieve your fitness goals with ease.',
    color: figmaTokens.colors.green500,
  },
  {
    icon: 'shield',
    title: 'Smart Reminders',
    description: 'Never miss a medication or appointment with intelligent reminders and notifications.',
    color: figmaTokens.colors.purple500,
  },
];

export default function OnboardingScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  const screen = onboardingScreens[currentScreen];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[figmaTokens.colors.blue50, figmaTokens.colors.purple50]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.skipContainer}>
          {currentScreen < onboardingScreens.length - 1 && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: screen.color }]}>
            <MaterialCommunityIcons name={screen.icon} size={96} color={figmaTokens.colors.white} />
          </View>

          <Text style={styles.title}>{screen.title}</Text>
          <Text style={styles.description}>{screen.description}</Text>

          <View style={styles.paginationDots}>
            {onboardingScreens.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentScreen ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>
              {currentScreen < onboardingScreens.length - 1 ? 'Next' : 'Get Started'}
            </Text>
            <MaterialCommunityIcons
              name={currentScreen < onboardingScreens.length - 1 ? 'chevron-right' : 'arrow-right'}
              size={20}
              color={figmaTokens.colors.white}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skipContainer: {
    width: '100%',
    alignItems: 'flex-end',
    padding: figmaTokens.spacing['6'],
  },
  skipButton: {
    padding: figmaTokens.spacing['2'],
  },
  skipButtonText: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: figmaTokens.spacing['6'],
    paddingBottom: figmaTokens.spacing['12'],
  },
  iconCircle: {
    borderRadius: figmaTokens.borderRadius.full,
    padding: figmaTokens.spacing['8'],
    marginBottom: figmaTokens.spacing['8'],
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    ...figmaTokens.shadows.lg,
  },
  title: {
    fontSize: figmaTokens.typography.fontSize['2xl'],
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    textAlign: 'center',
    marginBottom: figmaTokens.spacing['4'],
    paddingHorizontal: figmaTokens.spacing['4'],
  },
  description: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: figmaTokens.spacing['12'],
    lineHeight: figmaTokens.typography.lineHeight.normal * figmaTokens.typography.fontSize.base,
    paddingHorizontal: figmaTokens.spacing['4'],
  },
  paginationDots: {
    flexDirection: 'row',
    gap: figmaTokens.spacing['2'],
    marginBottom: figmaTokens.spacing['12'],
  },
  dot: {
    height: 8,
    borderRadius: figmaTokens.borderRadius.full,
  },
  activeDot: {
    width: 32,
    backgroundColor: figmaTokens.colors.blue500,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: figmaTokens.colors.gray300,
  },
  bottomContainer: {
    width: '100%',
    padding: figmaTokens.spacing['6'],
    paddingBottom: figmaTokens.spacing['8'],
  },
  nextButton: {
    width: '100%',
    backgroundColor: figmaTokens.colors.blue500,
    paddingVertical: figmaTokens.spacing['4'],
    borderRadius: figmaTokens.borderRadius['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: figmaTokens.spacing['2'],
    ...figmaTokens.shadows.lg,
  },
  nextButtonText: {
    color: figmaTokens.colors.white,
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
});

