// ✅ Main Layout
import { Stack } from 'expo-router';
import figmaTokens from '../../design-system/figmaTokens';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: figmaTokens.colors.gray50 || '#F5F5F5',
        },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="diet" />
      <Stack.Screen name="emergency" />
      <Stack.Screen name="ai-insights" />
      <Stack.Screen name="ocr" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="family" />
      <Stack.Screen name="health-tracker" />
    </Stack>
  );
}
