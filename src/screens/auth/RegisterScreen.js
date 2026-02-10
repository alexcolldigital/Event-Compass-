/**
 * Register Screen - Modern & Responsive
 * User registration with role selection
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Picker,
} from 'react-native';
import { useAuthStore } from '../../context/authContext';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/authStyles';
import { colors, spacing, borderRadius } from '../../styles/theme';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'client',
    businessName: '',
    businessCategory: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, isLoading, error: storeError } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};
    
    // First name validation
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    // Last name validation
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must have uppercase, lowercase, and number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone validation
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        newErrors.phone = 'Phone number must be 10-15 digits';
      }
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    // Service provider specific validation
    if (formData.role === 'service_provider') {
      if (!formData.businessName?.trim()) {
        newErrors.businessName = 'Business name is required for service providers';
      } else if (formData.businessName.trim().length < 3) {
        newErrors.businessName = 'Business name must be at least 3 characters';
      }
      
      if (!formData.businessCategory?.trim()) {
        newErrors.businessCategory = 'Business category is required for service providers';
      }
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // Sanitize phone number - remove all non-digits
      const sanitizedPhone = formData.phone.replace(/\D/g, '');
      
      // Validate phone length
      if (sanitizedPhone.length < 10 || sanitizedPhone.length > 15) {
        Alert.alert('Invalid Phone', 'Phone number must be between 10-15 digits');
        return;
      }

      const sanitizedData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: sanitizedPhone,
        role: formData.role,
        acceptTerms: formData.acceptTerms === true,
      };

      // Add optional fields only if role is service_provider
      if (formData.role === 'service_provider') {
        sanitizedData.businessName = formData.businessName.trim();
        sanitizedData.businessCategory = formData.businessCategory.trim();
      }

      console.log('📝 Submitting registration with data:', JSON.stringify(sanitizedData, null, 2));
      const result = await register(sanitizedData);
      console.log('✅ Registration successful:', result);
      Alert.alert('Success', 'Account created successfully! Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      console.log('❌ Registration error:', error);
      console.log('Error response:', error.response?.data);
      if (error.response?.data?.errors) {
        console.log('🔴 Validation errors:', JSON.stringify(error.response.data.errors, null, 2));
      }
      
      // Parse detailed error message
      let errorMsg = storeError || 'Registration failed';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMsg = error.response.data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      Alert.alert('Registration Error', errorMsg);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: spacing.lg }}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>✨</Text>
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Event Compass today</Text>
      </View>

      {/* Validation/Store Error Banner */}
      {Object.keys(errors).length > 0 && (
        <View style={styles.errorAlert}>
          <Ionicons name="alert-circle" size={18} color={colors.error} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={[styles.errorText, { fontWeight: '600' }]}>Please fix the errors below:</Text>
            {Object.entries(errors).slice(0, 3).map(([field, message]) => (
              <Text key={field} style={[styles.errorMessage, { marginTop: spacing.xs }]}>
                • {message}
              </Text>
            ))}
          </View>
        </View>
      )}

      {storeError && (
        <View style={styles.errorAlert}>
          <Text style={[styles.errorText, { fontWeight: '600' }]}>Registration Error:</Text>
          <Text style={[styles.errorMessage, { marginTop: spacing.xs }]}>{storeError}</Text>
        </View>
      )}

      {/* First Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <View style={[styles.passwordInputContainer, errors.firstName && styles.inputError]}>
          <Ionicons name="person" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
          <TextInput
            style={styles.passwordInput}
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            placeholder="John"
            placeholderTextColor={colors.gray[500]}
          />
        </View>
        {errors.firstName && <Text style={styles.errorMessage}>{errors.firstName}</Text>}
      </View>

      {/* Last Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name</Text>
        <View style={[styles.passwordInputContainer, errors.lastName && styles.inputError]}>
          <Ionicons name="person" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
          <TextInput
            style={styles.passwordInput}
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            placeholder="Doe"
            placeholderTextColor={colors.gray[500]}
          />
        </View>
        {errors.lastName && <Text style={styles.errorMessage}>{errors.lastName}</Text>}
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={[styles.passwordInputContainer, errors.email && styles.inputError]}>
          <Ionicons name="mail" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
          <TextInput
            style={styles.passwordInput}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            placeholder="john@example.com"
            placeholderTextColor={colors.gray[500]}
          />
        </View>
        {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}
      </View>

      {/* Phone */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone</Text>
        <View style={[styles.passwordInputContainer, errors.phone && styles.inputError]}>
          <Ionicons name="call" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
          <TextInput
            style={styles.passwordInput}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            placeholder="08012345678"
            placeholderTextColor={colors.gray[500]}
          />
        </View>
        {errors.phone && <Text style={styles.errorMessage}>{errors.phone}</Text>}
      </View>

      {/* Role */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>I am a</Text>
        <View style={[styles.passwordInputContainer, { paddingHorizontal: 0 }]}>
          <Ionicons name="briefcase" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
          <Picker
            selectedValue={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
            style={{ flex: 1, marginRight: spacing.lg }}
          >
            <Picker.Item label="Client" value="client" />
            <Picker.Item label="Service Provider" value="service_provider" />
          </Picker>
        </View>
      </View>

      {/* Business Name (for service providers) */}
      {formData.role === 'service_provider' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Name</Text>
          <View style={[styles.passwordInputContainer, errors.businessName && styles.inputError]}>
            <Ionicons name="storefront" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
            <TextInput
              style={styles.passwordInput}
              value={formData.businessName}
              onChangeText={(text) => setFormData({ ...formData, businessName: text })}
              placeholder="Your business name"
              placeholderTextColor={colors.gray[500]}
            />
          </View>
          {errors.businessName && <Text style={styles.errorMessage}>{errors.businessName}</Text>}
        </View>
      )}

      {/* Business Category (for service providers) */}
      {formData.role === 'service_provider' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Category</Text>
          <View style={[styles.passwordInputContainer, { paddingHorizontal: 0 }]}>
            <Ionicons name="list" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
            <Picker
              selectedValue={formData.businessCategory}
              onValueChange={(value) => setFormData({ ...formData, businessCategory: value })}
              style={{ flex: 1, marginRight: spacing.lg }}
            >
              <Picker.Item label="Select category" value="" />
              <Picker.Item label="Catering" value="catering" />
              <Picker.Item label="Photography" value="photography" />
              <Picker.Item label="Decoration" value="decoration" />
              <Picker.Item label="Entertainment" value="entertainment" />
              <Picker.Item label="Venue" value="venue" />
            </Picker>
          </View>
          {errors.businessCategory && <Text style={styles.errorMessage}>{errors.businessCategory}</Text>}
        </View>
      )}

      {/* Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={[styles.passwordInputContainer, errors.password && styles.inputError]}>
          <Ionicons name="lock-closed" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
          <TextInput
            style={styles.passwordInput}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.gray[500]}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingHorizontal: spacing.lg }}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}
        <Text style={[styles.errorMessage, { color: colors.gray[500], marginTop: spacing.sm }]}>
          Min 8 chars with uppercase, lowercase, and number
        </Text>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={[styles.passwordInputContainer, errors.confirmPassword && styles.inputError]}>
          <Ionicons name="lock-closed" size={20} color={colors.primary} style={{ marginHorizontal: spacing.lg }} />
          <TextInput
            style={styles.passwordInput}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.gray[500]}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ paddingHorizontal: spacing.lg }}>
            <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>}
      </View>

      {/* Terms and Conditions */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.xl }}>
        <TouchableOpacity
          onPress={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
          style={{
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: borderRadius.sm,
            marginRight: spacing.md,
            marginTop: spacing.xs,
            backgroundColor: formData.acceptTerms ? colors.primary : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {formData.acceptTerms && <Ionicons name="checkmark" size={14} color={colors.white} />}
        </TouchableOpacity>
        <Text style={{ fontSize: 13, color: colors.gray[600], flex: 1, lineHeight: 20 }}>
          I agree to the Terms and Conditions
        </Text>
      </View>
      {errors.acceptTerms && <Text style={[styles.errorMessage, { marginBottom: spacing.lg }]}>{errors.acceptTerms}</Text>}

      {/* Register Button */}
      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signUpLink}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom padding */}
      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}
