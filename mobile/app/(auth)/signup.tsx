import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { Button } from '@/components/ui/button';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  FadeInDown,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';

const ConfettiParticle = ({ delay, x, color }: { delay: number; x: number; color: string }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(Math.random() * 80 + 20, { duration: 1200 }));
    rotate.value = withDelay(delay, withTiming(Math.random() * 720 - 360, { duration: 1200 }));
    scale.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 600, delay: 400 })
    ));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: 0,
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const successScale = useSharedValue(0);

  const successAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: {} },
    });
    setLoading(false);
    if (error) {
      setServerError(error.message);
    } else {
      successScale.value = withSpring(1, { damping: 12 });
      setShowSuccess(true);
    }
  };

  const confettiColors = ['#00A385', '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D'];

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
              <Text style={styles.heading}>Create Account</Text>
              <Text style={styles.subtitle}>Create your account for daily updates</Text>
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

            <Animated.View entering={FadeInDown.delay(350).duration(400).springify()} style={{ marginBottom: 24 }}>
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
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#AAAAAA" />
                </Pressable>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(450).duration(400).springify()} style={{ marginBottom: 32 }}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#AAAAAA" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#BBBBBB"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  underlineColorAndroid="transparent"
                  cursorColor="#1A1A1A"
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={12}>
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#AAAAAA" />
                </Pressable>
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </Animated.View>

            {serverError ? (
              <Animated.View entering={FadeIn.duration(200)}>
                <Text style={styles.serverError}>{serverError}</Text>
              </Animated.View>
            ) : null}

            <Animated.View entering={FadeInDown.delay(550).duration(400).springify()}>
              <Button label="Create Account" onPress={handleSignup} loading={loading} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(300)} style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(650).duration(400).springify()}>
              <Pressable style={styles.socialBtn}>
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialBtnText}>Sign in with Google</Text>
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(700).duration(400).springify()}>
              <Pressable style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={22} color="#1A1A1A" />
                <Text style={styles.socialBtnText}>Sign in with Apple</Text>
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(750).duration(300)} style={styles.bottomLink}>
              <Text style={styles.bottomLinkText}>Already have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.bottomLinkBold}>Log in</Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.successSheet, successAnimStyle]} entering={SlideInDown.delay(100).springify()}>
            <View style={styles.confettiContainer}>
              {Array.from({ length: 30 }).map((_, i) => (
                <ConfettiParticle
                  key={i}
                  delay={i * 30}
                  x={Math.random() * (Dimensions.get('window').width - 80)}
                  color={confettiColors[i % confettiColors.length]}
                />
              ))}
            </View>

            <Animated.View style={styles.checkCircle} entering={FadeIn.delay(300).springify()}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(400)}>
              <Text style={styles.successTitle}>Successful!</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(400)}>
              <Text style={styles.successSubtitle}>
                Your account is created successfully{'\n'}and ready now.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(700).duration(400)} style={{ width: '100%' }}>
              <Pressable
                style={styles.successBtn}
                onPress={() => {
                  successScale.value = withTiming(0, { duration: 200 });
                  setTimeout(() => {
                    setShowSuccess(false);
                    router.replace('/(app)/');
                  }, 200);
                }}
              >
                <Text style={styles.successBtnText}>Browse Home</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  successSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: 'center',
    overflow: 'hidden',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#00A385',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#00A385',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  successSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successBtn: {
    backgroundColor: '#2C2C2E',
    borderRadius: 9999,
    paddingVertical: 18,
    alignItems: 'center',
  },
  successBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
