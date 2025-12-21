// ✅ Root Layout (FINAL WORKING)
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import figmaTokens from '../design-system/figmaTokens';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: figmaTokens.colors.primary,
    background: figmaTokens.colors.gray50,
    surface: '#fff',
    elevation: {
      level0: 'transparent',
      level1: '#f2f2f2',
      level2: '#ededed',
      level3: '#e6e6e6',
      level4: '#dedede',
      level5: '#d6d6d6',
    },
  },
};

function RootNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const seg = segments[0];
    const inAuth = seg === '(auth)';
    const isOnboarding = seg === 'onboarding';

    if (!user && !inAuth && !isOnboarding) {
      router.replace('/onboarding');
    }

    if (user && (inAuth || isOnboarding)) {
      router.replace('/(main)/dashboard');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={figmaTokens.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: figmaTokens.colors.gray50,
  },
});
