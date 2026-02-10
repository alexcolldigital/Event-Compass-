/**
 * Login Screen - Modern & Responsive
 * Handles user login with email and password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../context/authContext';
import styles from '../../styles/authStyles';
import { colors, spacing } from '../../styles/theme';

export default function LoginScreen({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailOrPhoneFocused, setEmailOrPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login, isLoading, error } = useAuthStore();

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors = {};
    const trimmedValue = emailOrPhone.trim();

    // Check if it's a valid email or phone
    const isEmail = /\S+@\S+\.\S+/.test(trimmedValue);
    const isPhone = /^[0-9]{10,15}$/.test(trimmedValue.replace(/\D/g, ''));

    if (!trimmedValue || (!isEmail && !isPhone)) {
      newErrors.emailOrPhone = 'Please enter a valid email or phone number';
    }

    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle login
   */
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const trimmedValue = emailOrPhone.trim();
      const isEmail = /\S+@\S+\.\S+/.test(trimmedValue);
      
      console.log('🔐 Login attempt with:', isEmail ? 'email' : 'phone');
      const loginPayload = isEmail
        ? {
            email: trimmedValue.toLowerCase(),
            password,
          }
        : {
            phone: trimmedValue.replace(/\D/g, ''),
            password,
          };
      console.log('📤 Sending login request:', JSON.stringify(loginPayload, null, 2));
      await login(loginPayload);
      console.log('✅ Login successful');
      // Navigation is handled by context
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = error || err.response?.data?.message || 'Please try again';
      console.error('Error message:', errorMsg);
      Alert.alert('Login Failed', errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Logo Header */}
        <View style={styles.headerSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🧭</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Event Compass</Text>
        </View>

        {/* Error Alert */}
        {error && (
          <View style={styles.errorAlert}>
            <Ionicons name="alert-circle" size={20} color={colors.error} style={{ marginRight: spacing.sm }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Email or Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email or Phone Number</Text>
          <View
            style={[
              styles.passwordInputContainer,
              emailOrPhoneFocused && styles.inputFocused,
              errors.emailOrPhone && styles.inputError,
            ]}
          >
            <Ionicons
              name="mail"
              size={20}
              color={emailOrPhoneFocused ? colors.primary : colors.gray[500]}
              style={{ marginHorizontal: spacing.lg, marginVertical: spacing.md }}
            />
            <TextInput
              style={[styles.passwordInput, { flex: 1 }]}
              placeholder="you@example.com or 1234567890"
              placeholderTextColor={colors.gray[500]}
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              keyboardType="email-address"
              editable={!isLoading}
              autoCapitalize="none"
              onFocus={() => setEmailOrPhoneFocused(true)}
              onBlur={() => setEmailOrPhoneFocused(false)}
            />
          </View>
          {errors.emailOrPhone && (
            <Text style={styles.errorMessage}>{errors.emailOrPhone}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.passwordInputContainer,
              passwordFocused && styles.inputFocused,
              errors.password && styles.inputError,
            ]}
          >
            <Ionicons
              name="lock-closed"
              size={20}
              color={passwordFocused ? colors.primary : colors.gray[500]}
              style={{ marginHorizontal: spacing.lg, marginVertical: spacing.md }}
            />
            <TextInput
              style={[styles.passwordInput, { flex: 1 }]}
              placeholder="••••••••"
              placeholderTextColor={colors.gray[500]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              style={{ paddingHorizontal: spacing.lg }}
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color={colors.gray[500]}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorMessage}>{errors.password}</Text>
          )}
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity style={styles.forgotPasswordContainer} disabled={isLoading}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.signUpLink}>Create One</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
