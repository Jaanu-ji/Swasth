// ✅ Register Screen - Similar to Login
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import figmaTokens from '../../design-system/figmaTokens';
import { FigmaCard } from '../../design-system/FigmaCard';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: 'Maintain',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!form.height || !form.weight) {
      Alert.alert('Error', 'Please enter your height and weight');
      return;
    }

    // Validate numeric values
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    if (isNaN(height) || height <= 0 || height > 300) {
      Alert.alert('Error', 'Please enter a valid height (1-300 cm)');
      return;
    }
    if (isNaN(weight) || weight <= 0 || weight > 500) {
      Alert.alert('Error', 'Please enter a valid weight (1-500 kg)');
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        age: form.age ? parseInt(form.age, 10) : undefined,
        gender: form.gender || undefined,
        height: height,
        weight: weight,
        goal: form.goal || 'Maintain',
      };

      await register(registrationData);
      // Navigation happens after successful registration
      router.replace('/(main)/dashboard');
    } catch (err) {
      // Show error message
      const errorMessage = err.message || 'Registration failed. Please check your information and try again.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={[figmaTokens.colors.blue50, figmaTokens.colors.purple50]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <FigmaCard style={styles.card}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={[figmaTokens.colors.blue500, figmaTokens.colors.purple500]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.logoCircle}
                  >
                    <MaterialCommunityIcons name="heart" size={48} color={figmaTokens.colors.white} />
                  </LinearGradient>
                </View>

                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Complete your profile to get started</Text>

                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name *</Text>
                    <TextInput
                      placeholder="Enter your name"
                      placeholderTextColor={figmaTokens.colors.gray400}
                      value={form.name}
                      onChangeText={(text) => setForm({ ...form, name: text })}
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons
                        name="email"
                        size={20}
                        color={figmaTokens.colors.gray400}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="your.email@example.com"
                        placeholderTextColor={figmaTokens.colors.gray400}
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color={figmaTokens.colors.gray400}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor={figmaTokens.colors.gray400}
                        value={form.password}
                        onChangeText={(text) => setForm({ ...form, password: text })}
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                      >
                        <MaterialCommunityIcons
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color={figmaTokens.colors.gray400}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput
                      placeholder="Age in years"
                      placeholderTextColor={figmaTokens.colors.gray400}
                      value={form.age}
                      onChangeText={(text) => setForm({ ...form, age: text })}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Height (cm) *</Text>
                    <TextInput
                      placeholder="Height in cm"
                      placeholderTextColor={figmaTokens.colors.gray400}
                      value={form.height}
                      onChangeText={(text) => setForm({ ...form, height: text })}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weight (kg) *</Text>
                    <TextInput
                      placeholder="Weight in kg"
                      placeholderTextColor={figmaTokens.colors.gray400}
                      value={form.weight}
                      onChangeText={(text) => setForm({ ...form, weight: text })}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[figmaTokens.colors.blue500, figmaTokens.colors.purple500]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.submitButtonGradient}
                    >
                      {loading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color={figmaTokens.colors.white} />
                          <Text style={styles.submitButtonText}>Creating Account...</Text>
                        </View>
                      ) : (
                        <Text style={styles.submitButtonText}>Register</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.loginLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </FigmaCard>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: figmaTokens.spacing['6'],
    paddingVertical: figmaTokens.spacing['12'],
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  card: {
    borderRadius: figmaTokens.borderRadius['3xl'],
    padding: figmaTokens.spacing['8'],
    ...figmaTokens.shadows.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: figmaTokens.spacing['6'],
  },
  logoCircle: {
    borderRadius: figmaTokens.borderRadius.full,
    padding: figmaTokens.spacing['4'],
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: figmaTokens.typography.fontSize['2xl'],
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray900,
    textAlign: 'center',
    marginBottom: figmaTokens.spacing['2'],
  },
  subtitle: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
    textAlign: 'center',
    marginBottom: figmaTokens.spacing['8'],
  },
  form: {
    gap: figmaTokens.spacing['4'],
  },
  inputContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
    color: figmaTokens.colors.gray700,
    marginBottom: figmaTokens.spacing['2'],
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: figmaTokens.spacing['4'],
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingLeft: 48,
    paddingRight: figmaTokens.spacing['4'],
    paddingVertical: figmaTokens.spacing['3'],
    borderWidth: 1,
    borderColor: figmaTokens.colors.gray300,
    borderRadius: figmaTokens.borderRadius.xl,
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray900,
    backgroundColor: figmaTokens.colors.white,
  },
  eyeButton: {
    position: 'absolute',
    right: figmaTokens.spacing['4'],
    padding: figmaTokens.spacing['2'],
  },
  submitButton: {
    width: '100%',
    borderRadius: figmaTokens.borderRadius.xl,
    overflow: 'hidden',
    ...figmaTokens.shadows.lg,
    marginTop: figmaTokens.spacing['4'],
  },
  submitButtonGradient: {
    paddingVertical: figmaTokens.spacing['3'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: figmaTokens.spacing['2'],
  },
  submitButtonText: {
    color: figmaTokens.colors.white,
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
  loginContainer: {
    marginTop: figmaTokens.spacing['6'],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: figmaTokens.typography.fontSize.base,
    color: figmaTokens.colors.gray600,
  },
  loginLink: {
    color: figmaTokens.colors.blue500,
    fontSize: figmaTokens.typography.fontSize.base,
    fontWeight: figmaTokens.typography.fontWeight.medium,
  },
});

