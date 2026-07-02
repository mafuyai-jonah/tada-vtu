import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Button } from '@/components/ui/button';
import Animated, {
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setServerError(error.message);
    } else {
      router.replace('/(app)/');
    }
  };

  return (
    <View style={styles.pageBg}>
      <SafeAreaView style={{ flex: 0 }}>
        <View style={styles.statusBar} />
      </SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeIn.delay(100).duration(300)}>
              <Pressable style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(150).duration(400).springify()}>
              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue to TADA</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(250).duration(400).springify()} style={{ marginBottom: 24 }}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color="#AAAAAA" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#BBBBBB"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  cursorColor="#1A1A1A"
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(350).duration(400).springify()} style={{ marginBottom: 4 }}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#AAAAAA" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#BBBBBB"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  underlineColorAndroid="transparent"
                  cursorColor="#1A1A1A"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={12}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={22}
                    color="#AAAAAA"
                  />
                </Pressable>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.forgotRow}>
              <Pressable style={styles.forgotLeft} onPress={() => setRememberMe(!rememberMe)}>
                <Ionicons name={rememberMe ? 'checkmark-circle' : 'checkmark-circle-outline'} size={20} color={rememberMe ? '#1A1A1A' : '#AAAAAA'} />
                <Text style={styles.forgotText}>Remember me</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </Pressable>
            </Animated.View>

            {serverError ? (
              <Animated.View entering={FadeIn.duration(200)}>
                <Text style={styles.serverError}>{serverError}</Text>
              </Animated.View>
            ) : null}

            <Animated.View entering={FadeInDown.delay(450).duration(400).springify()}>
              <Button label="Log In" onPress={handleLogin} loading={loading} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(300)} style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(550).duration(400).springify()}>
              <Pressable style={styles.socialBtn}>
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialBtnText}>Sign in with Google</Text>
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(400).springify()}>
              <Pressable style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={22} color="#1A1A1A" />
                <Text style={styles.socialBtnText}>Sign in with Apple</Text>
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(650).duration(300)} style={styles.bottomLink}>
              <Text style={styles.bottomLinkText}>Don't have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.bottomLinkBold}>Sign up</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageBg: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBar: {
    height: 0,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingHorizontal: 18,
    height: 56,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 0,
    borderWidth: 0,
    outlineStyle: 'none',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#FF4444',
    marginTop: 6,
    marginLeft: 4,
  },
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 28,
  },
  forgotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  forgotText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
  forgotLink: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#1A1A1A',
  },
  serverError: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#FF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D1D6',
  },
  dividerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#8E8E93',
    marginHorizontal: 16,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
    gap: 10,
  },
  socialBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#1A1A1A',
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 8,
  },
  bottomLinkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#8E8E93',
  },
  bottomLinkBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#1A1A1A',
  },
});
